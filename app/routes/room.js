const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

// Rota para criar uma nova sala de reunião
router.post('/', async (req, res) => {
  const { name, description, capacity } = req.body;

  try {
    const room = new Room({ name, description, capacity });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Rota para listar todas as salas de reunião
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Rota para participar de uma sala de reunião
router.post('/join', async (req, res) => {
  const { roomId } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send('Room not found');
    }
    res.json(room);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;