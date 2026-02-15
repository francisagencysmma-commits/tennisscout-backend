const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  jugadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  serveSpeed: Number,
  winRate: Number,
  forehandRPM: Number,
  totalMatches: Number,
  avgMatchDuration: String,
  breakPointsWon: Number,
  peakPerformance: Number,
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stats', statsSchema);