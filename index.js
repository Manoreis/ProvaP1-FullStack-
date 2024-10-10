const express = require('express');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Modelos
const User = require('./app/models/User');
const Room = require('./app/models/Room');

// Rotas e Middleware
const authMiddleware = require('./app/middleware/auth');
const userRoutes = require('./app/routes/user');
const roomRoutes = require('./app/routes/room');

app.use('/api/users', userRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);

// Configuração do Socket.io
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
    });

    socket.on('signal', (data) => {
      socket.broadcast.to(roomId).emit('signal', data);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));