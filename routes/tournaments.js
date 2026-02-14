const router = require('express').Router();
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');

// Obtener todos los videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('jugadorId', 'nombre pais');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener videos de un jugador
router.get('/player/:playerId', async (req, res) => {
  try {
    const videos = await Video.find({ jugadorId: req.params.playerId });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subir video
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({ error: 'No se ha subido ningún video' });
    }

    const videoFile = req.files.video;

    // Subir a Cloudinary (si está configurado)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.upload(videoFile.tempFilePath, {
        resource_type: 'video',
        folder: 'tennisscout/videos',
        chunk_size: 6000000
      });

      const video = new Video({
        jugadorId: req.body.jugadorId,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion || '',
        url: result.secure_url,
        thumbnail: result.thumbnail_url || result.secure_url,
        duracion: req.body.duracion || '',
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        cloudinaryId: result.public_id
      });

      await video.save();
      return res.status(201).json({ message: 'Video subido exitosamente', video });
    }

    // Si no hay Cloudinary, guardar solo metadata
    const video = new Video({
      jugadorId: req.body.jugadorId,
      titulo: req.body.titulo,
      descripcion: req.body.descripcion || '',
      url: 'https://via.placeholder.com/800x450',
      thumbnail: 'https://via.placeholder.com/400x225',
      duracion: req.body.duracion || '',
      tags: req.body.tags ? JSON.parse(req.body.tags) : []
    });

    await video.save();
    res.status(201).json({ message: 'Video creado (sin Cloudinary)', video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar video
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    if (video.cloudinaryId && process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Incrementar vistas
router.put('/:id/view', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { vistas: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;