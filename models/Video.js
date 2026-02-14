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
  descripcion: String,
  url: {
    type: String,
    required: true
  },
  thumbnail: String,
  duracion: String,
  tags: [String],
  vistas: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  cloudinaryId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);