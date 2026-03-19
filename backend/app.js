const express = require('express');
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require('dotenv').config();
require("./connection/conn");


const app = express();

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",  // frontend localhost
  "https://calmbridge.vercel.app"    // production frontend         
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow mobile apps, Postman, curl (no origin)
      if (!origin) return callback(null, true);

      // Check allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // If not allowed
      console.log(" CORS BLOCKED:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  })
);
// Middleware
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/user');
const assessmentRoutes = require('./routes/assessment');
const assessmentAnalytics = require('./routes/assessmentAnalytics');
const therapistRoutes = require('./routes/Therapist');
const bookingRoutes = require('./routes/Booking');

// Use Routes
app.use("/api/user", userRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/analytics", assessmentAnalytics);
app.use("/api/booking", bookingRoutes);
app.use("/api/therapist", therapistRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socket.id);

    io.to(roomId).emit("user-joined", rooms[roomId].size);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId].delete(socket.id);
      io.to(roomId).emit("user-joined", rooms[roomId].size);
    }
  });

  socket.on("disconnect", () => {
    for (let roomId in rooms) {
      rooms[roomId].delete(socket.id);
      io.to(roomId).emit("user-joined", rooms[roomId].size);
    }
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

