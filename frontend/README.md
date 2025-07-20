# **EchoMaze - React Game**

EchoMaze is an interactive maze game built with **React**, **TypeScript**, **Vite**, and **Axios**, featuring audio feedback and keyboard controls.

---

## **Features**

- Dynamic maze generation from a backend API.
- Audio feedback for wall collisions, movement, and victory.
- Keyboard controls (Arrow keys or WASD).
- Victory screen with move count and animations.
- Fully responsive UI with dynamic cell sizing.

---

## **Prerequisites**

Ensure you have the following installed on your machine:

- **Node.js** (>= 16)
- **npm** (>= 8) or **yarn**
- A backend server running at `http://localhost:8000` (or update `.env` with your backend URL).

---

## **Getting Started**

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/echo-maze.git
cd echo-maze
```

### 2. **Install dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Setup environment variables**

Create a `.env` file in the root directory and add:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> **Note:** Replace the URL with your actual backend server URL.

---

### 4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

This will start the development server, and you can access the app at:

```
http://localhost:5173
```

---

### 5. **Build for production**

```bash
npm run build
# or
yarn build
```

The production-ready files will be located in the `dist/` directory.

---

### 6. **Preview the production build**

```bash
npm run preview
```

---

## **Keyboard Controls**

- **Arrow keys** or **W/A/S/D** - Move the player.
- **Spacebar** - Restart the game.

---

## **Backend Setup**

The game communicates with a backend server that:

- Generates the maze.
- Processes player movements.
- Sends updated game states.

Ensure your backend (API) is running on the URL provided in `.env`.

---

## **Scripts**

- `npm run dev` – Start development server.
- `npm run build` – Build the app for production.
- `npm run preview` – Preview the production build.
- `npm run lint` – Run ESLint checks.

---

## **Tech Stack**

- **React 18 + Vite**
- **TypeScript**
- **Axios**
- **Mantine UI**
- **FontAwesome Icons**
