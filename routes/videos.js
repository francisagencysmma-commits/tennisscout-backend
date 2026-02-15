const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');

// GET - Obtener todos los videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('jugadorId', 'nombre fullName fotoPerfil')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error obteniendo videos:', error);
    res.status(500).json({ error: 'Error obteniendo videos' });
  }
});

// GET - Obtener videos de un jugador específico
router.get('/player/:playerId', async (req, res) => {
  try {
    const videos = await Video.find({ jugadorId: req.params.playerId })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error obteniendo videos del jugador:', error);
    res.status(500).json({ error: 'Error obteniendo videos' });
  }
});

// POST - Crear nuevo video
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== POST /api/videos ===');
    console.log('Body recibido:', req.body);
    console.log('Usuario autenticado:', req.user);

    const { jugadorId, titulo, descripcion, url, duracion } = req.body;

    if (!jugadorId || !titulo || !url) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: jugadorId, titulo, url' 
      });
    }

    const newVideo = new Video({
      jugadorId,
      titulo,
      descripcion: descripcion || '',
      url,
      duracion: duracion || 0,
      vistas: 0
    });

    await newVideo.save();
    console.log('Video guardado:', newVideo);

    // Populate antes de devolver
    await newVideo.populate('jugadorId', 'nombre fullName fotoPerfil');

    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error creando video:', error);
    res.status(500).json({ error: 'Error creando video', details: error.message });
  }
});

// PUT - Incrementar vistas
router.put('/:id/view', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { vistas: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    console.error('Error incrementando vistas:', error);
    res.status(500).json({ error: 'Error incrementando vistas' });
  }
});

// DELETE - Eliminar video
router.delete('/:id', auth, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video eliminado' });
  } catch (error) {
    console.error('Error eliminando video:', error);
    res.status(500).json({ error: 'Error eliminando video' });
  }
});

module.exports = router;