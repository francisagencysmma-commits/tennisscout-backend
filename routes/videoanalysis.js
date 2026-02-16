// routes/videoanalysis.js - Backend

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware de autenticación
const auth = require('../middleware/auth');

// POST /api/video-analysis - Analizar video
router.post('/', auth, async (req, res) => {
  try {
    const { videoUrl, playerName, playerId } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'URL del video requerida' });
    }

    console.log('Iniciando análisis de video:', videoUrl);

    // 1. Extraer frames del video (simplificado - usa el thumbnail)
    const videoThumbnail = videoUrl.replace('/upload/', '/upload/w_1280,q_auto/');

    // 2. Analizar con GPT-4 Vision
    const analysis = await analyzeVideoWithAI(videoThumbnail, playerName);

    // 3. Generar PDF
    const pdfPath = await generatePDF(analysis, playerName, videoUrl);

    // 4. Subir PDF a Cloudinary
    const pdfUrl = await uploadPDFToCloudinary(pdfPath);

    // 5. Guardar análisis en BD
    const Video = require('../models/Video');
    await Video.findOneAndUpdate(
      { url: videoUrl },
      { 
        aiAnalysis: analysis,
        analysisPdf: pdfUrl,
        analyzedAt: new Date()
      }
    );

    // 6. Limpiar archivo temporal
    fs.unlinkSync(pdfPath);

    res.json({
      success: true,
      analysis: analysis,
      pdfUrl: pdfUrl
    });

  } catch (error) {
    console.error('Error en análisis:', error);
    res.status(500).json({ 
      error: 'Error procesando análisis',
      details: error.message 
    });
  }
});

// Función para analizar con GPT-4 Vision
async function analyzeVideoWithAI(imageUrl, playerName) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // Modelo con visión
    messages: [
      {
        role: "system",
        content: `Eres un entrenador profesional de tenis con 20 años de experiencia. 
        Analiza videos/imágenes de tenis y proporciona análisis técnicos detallados y profesionales.
        Tu análisis debe ser exhaustivo, específico y orientado a scouts y entrenadores.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analiza este momento de juego de ${playerName || 'este jugador'} y proporciona:

1. ANÁLISIS TÉCNICO DETALLADO:
   - Postura y equilibrio
   - Técnica de golpeo (grip, preparación, punto de contacto, terminación)
   - Juego de pies y posicionamiento
   - Mecánica corporal (rotación, transferencia de peso)

2. FORTALEZAS IDENTIFICADAS:
   - Qué hace bien este jugador
   - Aspectos técnicos destacables
   - Ventajas competitivas

3. ÁREAS DE MEJORA:
   - Aspectos técnicos a corregir
   - Puntos débiles observados
   - Recomendaciones específicas

4. POTENCIAL COMPETITIVO:
   - Nivel estimado (junior, universitario, profesional)
   - Proyección de desarrollo
   - Comparación con estándares del circuito

5. RECOMENDACIONES PARA ENTRENAMIENTO:
   - Ejercicios específicos sugeridos
   - Áreas prioritarias de trabajo
   - Plan de desarrollo a 6 meses

Proporciona un análisis profesional, detallado y honesto que justifique una inversión de una academia.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    max_tokens: 2000
  });

  return response.choices[0].message.content;
}

// Función para generar PDF
async function generatePDF(analysis, playerName, videoUrl) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const filename = `analysis_${Date.now()}.pdf`;
    const filepath = `/tmp/${filename}`;
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Header
    doc.fontSize(24)
       .fillColor('#cdff00')
       .text('TENNISSCOUT AI', { align: 'center' });
    
    doc.fontSize(20)
       .fillColor('#000000')
       .text('Análisis Técnico Profesional', { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(12)
       .fillColor('#666666')
       .text(`Jugador: ${playerName || 'N/A'}`, { align: 'center' });
    
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    
    doc.moveDown(2);

    // Línea separadora
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .strokeColor('#cdff00')
       .lineWidth(2)
       .stroke();

    doc.moveDown(2);

    // Contenido del análisis
    doc.fontSize(11)
       .fillColor('#000000')
       .text(analysis, {
         align: 'justify',
         lineGap: 5
       });

    // Footer
    doc.moveDown(3);
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .strokeColor('#cccccc')
       .lineWidth(1)
       .stroke();

    doc.moveDown();
    doc.fontSize(9)
       .fillColor('#999999')
       .text('Este análisis ha sido generado por TennisScout AI', { align: 'center' });
    
    doc.text('Tecnología de análisis con IA avanzada', { align: 'center' });
    doc.text(`Video analizado: ${videoUrl}`, { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      resolve(filepath);
    });

    stream.on('error', reject);
  });
}

// Función para subir PDF a Cloudinary
async function uploadPDFToCloudinary(filepath) {
  const cloudinary = require('cloudinary').v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfiw0rscm',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const result = await cloudinary.uploader.upload(filepath, {
    resource_type: 'raw',
    folder: 'tennis_analysis',
    format: 'pdf'
  });

  return result.secure_url;
}

module.exports = router;