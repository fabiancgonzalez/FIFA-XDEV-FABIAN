const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');

const router = express.Router();

// Ruta para verificar y rehash de contraseña si es necesario
router.post('/verify-password', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar el usuario
    const user = await User.findOne({ where: { username: usuario } });
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Información de diagnóstico sobre la contraseña almacenada
    const passwordInfo = {
      format: 'md5',
      length: user.password.length,
      preview: user.password.substring(0, 10) + '...'
    };

    // Intentar verificar la contraseña con MD5
    try {
      const md5Hash = crypto.createHash('md5').update(password).digest('hex');
      const isValid = md5Hash === user.password;
      
      // Respuesta si la contraseña es válida
      if (isValid) {
        return res.json({
          message: 'Contraseña verificada correctamente',
          wasRehashed: false,
          passwordInfo
        });
      }

      // Si la contraseña no es válida
      return res.status(401).json({
        message: 'Contraseña incorrecta',
        passwordInfo
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Error al verificar contraseña',
        error: error.message,
        passwordInfo
      });
    }

  } catch (error) {
    console.error('Error en verify-password:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para forzar rehash de contraseña
router.post('/force-rehash', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos'
      });
    }

    const user = await User.findOne({ where: { username: usuario } });
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Forzar nuevo hash con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    
    // Guardar nuevo hash
    await user.update({ password: hashedPassword });

    res.json({
      message: 'Contraseña rehasheada exitosamente',
      newHashInfo: {
        format: 'md5',
        length: hashedPassword.length,
        preview: hashedPassword.substring(0, 10) + '...'
      }
    });

  } catch (error) {
    console.error('Error en force-rehash:', error);
    res.status(500).json({
      message: 'Error al rehashear contraseña',
      error: error.message
    });
  }
});

module.exports = router;