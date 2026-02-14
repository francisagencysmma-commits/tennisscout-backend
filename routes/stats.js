const router = require('express').Router();
const Stats = require('../models/Stats');

// Obtener estadísticas de un jugador
router.get('/player/:playerId', async (req, res) => {
  try {
    const stats = await Stats.find({ jugadorId: req.params.playerId }).sort({ fecha: -1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear/Actualizar estadísticas
router.post('/', async (req, res) => {
  try {
    const stats = new Stats(req.body);
    await stats.save();
    res.status(201).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;