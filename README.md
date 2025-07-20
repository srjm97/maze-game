# Maze Game

A full-stack web-based maze game featuring user authentication, high scores, and multiple game modes. Built with a Python FastAPI backend and a modern React + Vite frontend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup](#docker-setup)
- [Game Modes](#game-modes)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🧩 Maze and Tiles game modes
- 🔒 User authentication (login/register)
- 🏆 High scores leaderboard
- 🎮 Responsive UI with animations
- 🗣️ Voice command support
- 📊 Game statistics and controls

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy
- **Frontend:** React, Vite, TypeScript
- **Database:** SQLite (default, configurable)
- **Containerization:** Docker, Docker Compose
- **Web Server:** Nginx

---

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```sh
   uvicorn app:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Docker Setup

1. Build and start all services:
   ```sh
   docker-compose up --build
   ```
2. Access the app at [http://localhost](http://localhost)

---

## Game Modes

- **Maze Game:** Navigate through randomly generated mazes.
- **Tiles Game:** Solve tile-based puzzles with increasing difficulty.

---

## API Endpoints

The backend exposes RESTful endpoints for authentication, game logic, and high scores. See `backend/app.py` and `backend/auth.py` for details.

---

## Project Structure

```
maze-game/
├── backend/         # FastAPI backend
│   ├── games/       # Game logic modules
│   ├── models.py    # Database models
│   ├── auth.py      # Authentication logic
│   └── ...
├── frontend/        # React + Vite frontend
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── ...
├── Dockerfiles/     # Dockerfiles for backend & frontend
├── docker-compose.yml
├── nginx/           # Nginx config
└── README.md
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## License

This project is licensed under the MIT License.

---