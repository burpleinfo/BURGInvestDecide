# BURGInvestDecide Setup Guide

This project consists of a frontend (React + Vite) and a backend (Node.js/Express). Follow the steps below to set up and run both parts locally.

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Backend Setup

1. **Navigate to the backend directory:**
   ```sh
   cd server
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the backend server:**
   ```sh
   npm start
   ```
   The backend will typically run on [http://localhost:3000](http://localhost:3000) (check your `server/index.js` for the exact port).

---

## Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```sh
   cd client
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the frontend development server:**
   ```sh
   npm run dev
   ```
   The frontend will typically run on [http://localhost:5173](http://localhost:5173) (or as specified in Vite config).

---

## Development Workflow
- The backend and frontend run independently. Start both servers for full functionality.
- Update API endpoints in the frontend as needed to match your backend server address.

---

## Troubleshooting
- Ensure both servers are running on different ports.
- If you encounter CORS issues, configure CORS in your backend (`server/index.js`).
- For additional configuration, check the respective `README.md` files in `client/` and `server/` if available.

---

## Project Structure
```
client/    # React frontend (Vite)
server/    # Node.js backend (Express)
```

---

## License
Specify your license here.
