const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const PlayerStats = require('../models/playerStats');
const Player = require('../models/player');
const { Op } = require('sequelize');

// Configurar multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'stats-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (path.extname(file.originalname) !== '.csv') {
      return cb(new Error('Solo se permiten archivos CSV'));
    }
    cb(null, true);
  }
});

// Controlador para obtener estadísticas históricas
const getHistoricalStats = async (req, res) => {
  try {
    const { playerId, skill } = req.query;

    if (!playerId || !skill) {
      return res.status(400).json({ 
        message: 'Se requiere playerId y skill' 
      });
    }

    const stats = await PlayerStats.findAll({
      where: {
        playerId: playerId,
        skill: skill
      },
      order: [['year', 'ASC']]
    });

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

// Controlador para importar CSV
const importStats = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
  }

  const results = [];
  const errors = [];

  try {
    // Leer el archivo CSV
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Procesar cada fila
          for (const row of results) {
            try {
              // Buscar o crear el jugador si no existe
              const [player] = await Player.findOrCreate({
                where: { 
                  name: row.player_name,
                  // Agregar otros campos relevantes del jugador
                }
              });

              // Crear o actualizar las estadísticas
              await PlayerStats.create({
                playerId: player.id,
                year: parseInt(row.year),
                skill: row.skill,
                value: parseInt(row.value)
              });
            } catch (error) {
              errors.push({
                row: row,
                error: error.message
              });
            }
          }

          // Eliminar el archivo después de procesarlo
          fs.unlinkSync(req.file.path);

          res.json({
            message: 'Importación completada',
            totalProcessed: results.length,
            errors: errors
          });
        } catch (error) {
          console.error('Error al procesar el CSV:', error);
          res.status(500).json({
            message: 'Error al procesar el CSV',
            error: error.message
          });
        }
      });
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    res.status(500).json({
      message: 'Error al leer el archivo',
      error: error.message
    });
  }
};

// Obtener lista de habilidades disponibles
const getAvailableSkills = async (req, res) => {
  try {
    const skills = await PlayerStats.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('skill')), 'skill']
      ],
      order: [['skill', 'ASC']]
    });

    res.json(skills.map(s => s.skill));
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    res.status(500).json({
      message: 'Error al obtener habilidades',
      error: error.message
    });
  }
};

module.exports = {
  getHistoricalStats,
  importStats,
  getAvailableSkills,
  upload
};