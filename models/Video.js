const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  jugadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  duracion: {
    type: Number,
    default: 0
  },
  vistas: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);