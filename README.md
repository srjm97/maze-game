# EchoMaze Backend API

A RESTful backend service for the EchoMaze game, providing maze generation and game state management.

## Features

- Maze generation with configurable dimensions
- Player movement validation
- Game state management
- Wall detection

## Installation

1. Ensure you have Python 3.8+ installed
2. Install requirements:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

```bash
python backend.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### Create New Game
- `POST /game`
- Body: `{"width": 10, "height": 10}`
- Returns: Game ID

### Get Game State
- `GET /game/{game_id}`
- Returns: Current game state including player position, goal position, and maze layout

### Move Player
- `POST /game/{game_id}/move`
- Body: `{"direction": "up|down|left|right"}`
- Returns: Updated game state

### Get Nearby Walls
- `GET /game/{game_id}/walls`
- Returns: List of wall positions adjacent to player

## Example Usage

```bash
# Create a new game
curl -X POST "http://localhost:8000/game" -H "Content-Type: application/json" -d '{"width": 10, "height": 10}'

# Move player right
curl -X POST "http://localhost:8000/game/1234/move" -H "Content-Type: application/json" -d '{"direction": "right"}'
```