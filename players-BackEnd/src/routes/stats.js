const express = require('express');
const { getHistoricalStats, importStats, getAvailableSkills, upload } = require('../controllers/stats.controller');
const router = express.Router();

// Ruta para obtener estadísticas históricas
router.get('/historical', getHistoricalStats);

// Ruta para obtener lista de habilidades disponibles
router.get('/skills', getAvailableSkills);

// Ruta para importar CSV
router.post('/import', upload.single('file'), importStats);

module.exports = router;