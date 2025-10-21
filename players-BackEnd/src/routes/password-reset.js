const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/update-password', async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Se requieren todos los campos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Contraseña actual incorrecta' 
      });
    }

    // Generar hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await user.update({ password: hashedPassword });

    res.json({ 
      message: 'Contraseña actualizada exitosamente',
      hashInfo: {
        format: 'bcrypt',
        length: hashedPassword.length,
        preview: hashedPassword.substring(0, 10) + '...'
      }
    });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ 
      message: 'Error al actualizar contraseña',
      error: error.message 
    });
  }
});

module.exports = router;