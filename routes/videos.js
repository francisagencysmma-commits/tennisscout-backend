const router = require('express').Router();
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');

// Obtener todos los videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('jugadorId', 'nombre pais');
    res.json(videos);
  } catch (error) {
    console.error('Error obteniendo videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener videos de un jugador
router.get('/player/:playerId', async (req, res) => {
  try {
    const videos = await Video.find({ jugadorId: req.params.playerId });
    res.json(videos);
  } catch (error) {
    console.error('Error obteniendo videos del jugador:', error);
    res.status(500).json({ error: error.message });
  }
});

// Subir video
router.post('/upload', async (req, res) => {
  try {
    console.log('📹 Recibiendo petición de subida...');
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    if (!req.files || !req.files.video) {
      return res.status(400).json({ error: 'No se ha subido ningún video' });
    }

    const videoFile = req.files.video;
    console.log('📦 Archivo recibido:', videoFile.name, videoFile.size, 'bytes');

    console.log('☁️ Subiendo a Cloudinary...');
    
    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(videoFile.tempFilePath, {
      resource_type: 'video',
      folder: 'tennisscout/videos',
      chunk_size: 6000000
    });

    console.log('✅ Cloudinary upload exitoso:', result.public_id);

    // Crear video en DB
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
    console.log('💾 Video guardado en DB:', video._id);

    res.status(201).json({
      message: 'Video subido exitosamente',
      video
    });
  } catch (error) {
    console.error('❌ Error completo:', error);
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

    // Eliminar de Cloudinary
    if (video.cloudinaryId) {
      await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
    }

    // Eliminar de DB
    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando video:', error);
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
    console.error('Error incrementando vistas:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
