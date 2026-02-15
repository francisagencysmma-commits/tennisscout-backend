const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  jugadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  resultado: String,
  ubicacion: String,
  fecha: Date,
  superficie: String,
  nivel: String,
  puntos: Number,
  premio: Number,
  matches: Number,
  winRate: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tournament', tournamentSchema);