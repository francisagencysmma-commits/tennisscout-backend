const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['jugador', 'scout', 'academia'],
    default: 'jugador'
  },
  pais: String,
  edad: Number,
  utrRating: Number,
  foto: String,
  bio: String,
  academia: String,
  entrenador: String,
  telefono: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema);