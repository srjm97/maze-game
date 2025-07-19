from datetime import datetime
import logging
from bson import ObjectId
from fastapi import Depends, FastAPI, File, HTTPException, Query, Request, UploadFile
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import uvicorn
import random
from elevenlabs import ElevenLabs

from auth import GoogleAuth, create_access_token, get_current_user
from database import close_mongo_connection, connect_to_mongo, get_database
from games.maze_game import GameConfig, GameState, MazeGame, MoveRequest
from models import Token, User, UserResponse
from config import settings

logger = logging.getLogger(__name__)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="EchoMaze Backend", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active games
games = {}
    
@app.get("/auth/google/login")
async def google_login():
    """Get Google OAuth login URL"""
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.BACKEND_BASE_URL}/auth/google/callback&"
        f"scope=openid email profile&"
        f"response_type=code&"
        f"access_type=offline"
    )
    return {"auth_url": google_auth_url}

@app.get("/auth/google/callback")
async def google_callback(
    code: str = Query(...),
    db = Depends(get_database)
):
    """Handle Google OAuth callback"""
    try:
        # Exchange code for token
        token_data = await GoogleAuth.exchange_code_for_token(
            code, f"{settings.BACKEND_BASE_URL}/auth/google/callback"
        )
        
        # Get user info from Google
        user_info = await GoogleAuth.get_user_info(token_data["access_token"])
        
        # Check if user exists in database
        existing_user = await db.users.find_one({"google_id": user_info["id"]})
        
        if existing_user:
            # Update existing user
            await db.users.update_one(
                {"_id": existing_user["_id"]},
                {"$set": {
                    "name": user_info["name"],
                    "picture": user_info.get("picture"),
                    "updated_at": datetime.now()
                }}
            )
            user_id = str(existing_user["_id"])
        else:
            # Create new user
            new_user = User(
                email=user_info["email"],
                name=user_info["name"],
                picture=user_info.get("picture"),
                google_id=user_info["id"]
            )
            
            result = await db.users.insert_one(new_user.model_dump(by_alias=True))
            user_id = str(result.inserted_id)
        
        # Create JWT token
        access_token = create_access_token(data={"sub": user_id})
        
        # Get user for response
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        user_response = UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            picture=user.get("picture"),
            created_at=user["created_at"]
        )   
        return RedirectResponse(url=f"{settings.FRONTEND_BASE_URL}/?token={access_token}")
        
    except Exception as e:
        logger.error(f"Google callback error: {e}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@app.post("/auth/logout")
async def logout(current_user: UserResponse = Depends(get_current_user)):
    """Logout user (client should remove token)"""
    return {"message": "Successfully logged out"}

@app.get("/protected")
async def protected_route(current_user: UserResponse = Depends(get_current_user)):
    """Example protected route"""
    return {"message": f"Hello {current_user.name}, this is a protected route!"}

@app.post("/game", response_model=str)
async def create_game(config: GameConfig):
    game_id = str(random.randint(1000, 9999))
    games[game_id] = MazeGame(config.width, config.height)
    return game_id

@app.get("/game/{game_id}", response_model=GameState)
async def get_game(game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    return games[game_id].get_game_state()

@app.post("/game/{game_id}/move")
async def move_player(game_id: str, move: MoveRequest):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    if move.direction not in ["up", "down", "left", "right"]:
        raise HTTPException(status_code=400, detail="Invalid direction")
    
    game = games[game_id]
    success = game.move_player(move.direction)
    
    if not success:
        raise HTTPException(status_code=400, detail="Invalid move")
    
    return game.get_game_state()

@app.get("/game/{game_id}/walls")
async def get_nearby_walls(game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    return games[game_id].get_nearby_walls()

@app.post("/score/add")
async def add_score(
    user_email: str = Query(...),
    game_name: str = Query(...),
    score: int = Query(...),
    db = Depends(get_database)
):
    """Add a score for a user in a specific game"""
    score_doc = {
        "user_email": user_email,
        "game_name": game_name,
        "score": score,
        "created_at": datetime.now()
    }
    result = await db.scores.insert_one(score_doc)
    return {"message": "Score added", "score_id": str(result.inserted_id)}

@app.get("/score/highest")
async def get_highest_score(
    user_email: str = Query(...),
    game_name: str = Query(...),
    db = Depends(get_database)
):
    """Get the highest score for a user in a specific game"""
    score_doc = await db.scores.find_one(
        {"user_email": user_email, "game_name": game_name},
        sort=[("score", -1)]
    )
    if not score_doc:
        raise HTTPException(status_code=404, detail="Score not found")
    return {"user_email": score_doc["user_email"], "game_name": score_doc["game_name"], "highest_score": score_doc["score"]}

@app.get("/score/top10")
async def get_top_10_scores(
    game_name: str = Query(...),
    db = Depends(get_database)
):
    """Get top 10 scores for a specific game across all users"""
    cursor = db.scores.find({"game_name": game_name}).sort("score", -1).limit(10)
    top_scores = []
    async for score_doc in cursor:
        top_scores.append({
            "user_email": score_doc["user_email"],
            "score": score_doc["score"]
        })
    return {"game_name": game_name, "top_10_scores": top_scores}

@app.post("/audio")
async def handle_audio(file: UploadFile = File(...)):
    client = ElevenLabs(api_key=settings.ELEVEN_LABS_KEY)
    
    # Save the uploaded file to memory
    contents = await file.read()
    
    response = client.speech_to_text.convert(
        model_id="scribe_v1",
        file=contents,
    )
    return response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

