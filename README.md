# 🎮 Game Console

> **An inclusive web-based gaming platform for the visually impaired**, featuring audio-guided maze navigation, voice-controlled tile puzzles, and global scoreboards.

Built with ❤️ using **FastAPI**, **React + Vite**, and advanced **speech technologies**.

---

## 🧠 What’s Inside?

* 🧩 **Maze Game** with real-time **audio cues** for navigation
* 🗣️ **Tile Game** powered by **voice commands**
* 📊 **Leaderboard system** for both **individual** and **global** scoring
* 🔒 Seamless **user authentication**
* 🎯 Intuitive and **accessible UX** with responsive design
* 🧏‍♂️ Designed for **visually impaired players**

---

## 🚀 Tech Stack

| Layer          | Tech Stack                                           |
| -------------- | ---------------------------------------------------- |
| **Backend**    | Python 3.13, FastAPI, SQLAlchemy                     |
| **Frontend**   | Node.js 24, React + Vite, TypeScript                 |
| **Database**   | SQLite (default, configurable)                       |
| **Speech**     | [ElevenLabs](https://www.elevenlabs.io/) for TTS/STT |
| **Deployment** | Docker, Docker Compose, Nginx                        |

---

## 🛠️ Getting Started

### 🔁 Prerequisites

* **Python:** 3.13+
* **Node.js:** 24.x+
* **npm:** 9+

---

### 🐍 Backend Setup (FastAPI)

1. Create a Python virtual environment:

   ```sh
   python3.13 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:

   ```sh
   pip install -r requirements.txt
   ```
3. Run the server:

   ```sh
   python3 app.py
   ```
4. Access the API at:
   [http://localhost:8000](http://localhost:8000)

---

### 🌐 Frontend Setup (React + Vite)

1. Navigate to the frontend directory:

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
4. Access the frontend at:
   [http://localhost:5173](http://localhost:5173)

---

### 🐳 Docker Setup

To run everything using Docker:

```sh
docker-compose up --build
```

Access the platform at: [http://localhost](http://localhost)

---

## 🕹️ Game Modes

### 🎧 Maze Game

Navigate procedurally generated mazes using **audio instructions**. Perfectly tailored for screen-free gameplay.

### 🗣️ Tile Game

Solve increasingly challenging tile puzzles using **natural voice commands**. Accessible and fun for everyone.

---

## 🔗 API Endpoints

Available for:

* `POST /register` – User registration
* `POST /login` – User login
* `GET /score/global` – Global leaderboard
* `GET /score/user` – Individual user scores
* `POST /maze/submit` – Maze game results
* `POST /tiles/submit` – Tile game results

*Explore all routes in `backend/app.py` and `auth.py`.*

---

## 📁 Project Structure

```
Game-Console/
├── backend/         # FastAPI backend
│   ├── games/       # Game logic (maze, tiles)
│   ├── models.py    # SQLAlchemy models
│   ├── auth.py      # Auth routes
│   └── app.py       # Main entry point
├── frontend/        # React + Vite frontend
│   ├── src/         # App source files
│   ├── public/      # Static assets
├── Dockerfiles/     # Docker configurations
├── docker-compose.yml
├── nginx/           # Nginx reverse proxy config
└── README.md
```

---

## 🌍 Accessibility Matters

Game Console empowers users with visual impairments to **engage and enjoy** gaming like never before. Using **text-to-speech** and **speech-to-text** via ElevenLabs, we've crafted a **truly inclusive** experience.

---

## 🤝 Contributing

We welcome contributions!
Feel free to fork the repo, create issues, and submit pull requests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
