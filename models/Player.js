const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  // Datos básicos de registro
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  edad: { type: Number },
  pais: { type: String },
  
  // Información completa
  fullName: { type: String },
  dateOfBirth: { type: Date },
  country: { type: String },
  
  // Premium
  isPremium: { type: Boolean, default: false },
  premiumUntil: { type: Date, default: null },
  
  // Posición y técnica de PÁDEL
  position: { type: String }, // Drive o Revés
  playingSide: { type: String }, // Derecha o Izquierda
  dominantHand: { type: String }, // Diestro o Zurdo
  
  // Nivel y experiencia
  playingLevel: { type: String }, // Principiante, Intermedio, Avanzado, etc.
  yearsPlaying: { type: Number },
  ranking: { type: String },
  
  // Golpes y técnica de PÁDEL
  strongestShot: { type: String }, // Bandeja, Víbora, Remate, Volea, Dejada
  bestSkill: { type: String }, // Red, Fondo, Control, Potencia, etc.
  bestSkills: [{ type: String }], // Array de habilidades
  weakestShot: { type: String },
  serveType: { type: String }, // Plano, Cortado, Liftado
  
  // Estilo de juego
  playingStyle: { type: String }, // Agresivo, Defensivo, Equilibrado, Táctico
  preferredSurface: { type: String }, // Césped artificial, Cemento, Cristal
  
  // Físico
  height: { type: Number },
  weight: { type: Number },
  
  // Experiencia competitiva
  hasCompetitiveExperience: { type: Boolean, default: false },
  tournamentLevel: { type: String }, // Local, Regional, Nacional, Internacional
  currentClub: { type: String },
  currentCoach: { type: String },
  
  // Entrenamiento
  weeklyHours: { type: Number },
  trainingFocus: { type: String }, // Técnica, Físico, Táctico, Mental
  
  // Objetivos
  goals: { type: String },
  availability: { type: String }, // Tiempo completo, Parcial, etc.
  weeklyAvailability: [{ type: String }], // Array del grid de disponibilidad
  
  // Foto de perfil
  fotoPerfil: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Player', playerSchema);