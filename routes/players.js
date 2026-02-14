const router = require('express').Router();
const Player = require('../models/Player');

// Obtener todos los jugadores
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().select('-password');
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un jugador por ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).select('-password');
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar jugador
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar jugadores
router.get('/search/:query', async (req, res) => {
  try {
    const players = await Player.find({
      $or: [
        { nombre: { $regex: req.params.query, $options: 'i' } },
        { pais: { $regex: req.params.query, $options: 'i' } }
      ]
    }).select('-password');
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;