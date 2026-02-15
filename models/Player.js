const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  // Datos básicos de registro
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  edad: { type: Number },
  pais: { type: String },
  utrRating: { type: Number, default: 0 },
  
  // Foto de perfil
  fotoPerfil: { type: String, default: '' },
  
  // ONBOARDING - Basic Info
  fullName: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  country: { type: String, default: '' },
  
  // ONBOARDING - Physical
  handedness: { type: String, default: '' }, // Diestro/Zurdo
  height: { type: Number, default: 0 }, // cm
  weight: { type: Number, default: 0 }, // kg
  
  // ONBOARDING - Experience
  yearsPlaying: { type: Number, default: 0 },
  ageStartedPlaying: { type: Number, default: 0 },
  
  // ONBOARDING - Competition
  officialTournamentsPlayed: { type: Number, default: 0 },
  nationalRanking: { type: String, default: '' },
  
  // ONBOARDING - Training
  currentCoachOrAcademy: { type: String, default: '' },
  weeklyTrainingHours: { type: Number, default: 0 },
  
  // ONBOARDING - Playing Style
  strongestStroke: { type: String, default: '' },
  playingStyle: { type: String, default: '' },
  firstServeConsistency: { type: Number, default: 0 }, // percentage
  
  // ONBOARDING - Health
  injuryHistory: { type: String, default: '' },
  
  // Sistema
  tipo: { type: String, enum: ['jugador', 'scout', 'academia'], default: 'jugador' },
  fechaRegistro: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);