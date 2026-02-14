const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, tipo } = req.body;

    console.log('📝 Intentando registrar:', { nombre, email, tipo });

    // Verificar si el usuario ya existe
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear jugador
    const player = new Player({
      nombre,
      email,
      password: hashedPassword,
      tipo: tipo || 'jugador'
    });

    await player.save();
    console.log('✅ Jugador creado:', player._id);

    // Crear token
    const token = jwt.sign(
      { id: player._id },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      player: {
        id: player._id,
        nombre: player.nombre,
        email: player.email,
        tipo: player.tipo
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar jugador
    const player = await Player.findOne({ email });
    if (!player) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Crear token
    const token = jwt.sign(
      { id: player._id },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      player: {
        id: player._id,
        nombre: player.nombre,
        email: player.email,
        tipo: player.tipo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;