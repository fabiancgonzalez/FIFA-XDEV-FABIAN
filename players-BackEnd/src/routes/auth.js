const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Op } = require('sequelize');
const User = require('../models/user');
const crypto = require('crypto');

const router = express.Router();
const secret = process.env.JWT_SECRET || 'claveSecretaQueSoloElServerConoce';

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    console.log('Intento de login:', {
      usuario,
      tienePassword: !!password
    });

    if (!usuario || !password) {
      return res.status(400).json({ 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    const user = await User.findOne({ 
      where: { username: usuario } 
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // Log de la contraseña almacenada
    console.log('Datos de la contraseña almacenada:', {
      storedPassword: user.password,
      receivedPassword: password,
      passwordLength: password.length
    });

    // Usar el método comparePassword del modelo
    const isValidPassword = user.comparePassword(password);
    
    console.log('Verificación de contraseña:', {
      usuarioEncontrado: true,
      contraseñaValida: isValidPassword,
      passwordMatch: password === user.password ? 'directMatch' : 'noDirectMatch'
    });

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      }, 
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
});

// Ruta temporal para actualizar contraseña fabian a MD5
router.post('/update-fabian-md5', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: 'fabian' } });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario fabian no encontrado' });
    }

    // Generar hash MD5 de la contraseña 'xdevfabian'
    const md5Password = crypto.createHash('md5').update('xdevfabian').digest('hex');
    
    console.log('Actualizando contraseña fabian:', {
      currentPassword: user.password,
      newMD5Password: md5Password
    });

    // Actualizar directamente en la base de datos
    await User.update(
      { password: md5Password },
      { where: { username: 'fabian' } }
    );

    res.json({ 
      message: 'Contraseña de fabian actualizada a MD5', 
      md5Hash: md5Password 
    });

  } catch (error) {
    console.error('Error actualizando contraseña fabian:', error);
    res.status(500).json({ 
      message: 'Error al actualizar contraseña',
      error: error.message 
    });
  }
});

// Ruta para resetear contraseña (requiere el usuario actual y la nueva contraseña)
router.post('/reset-password', async (req, res) => {
  try {
    const { usuario, newPassword } = req.body;
    
    if (!usuario || !newPassword) {
      return res.status(400).json({ 
        message: 'Se requiere usuario y nueva contraseña' 
      });
    }

    const user = await User.findOne({ where: { username: usuario } });
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Generar hash MD5 de la contraseña
    const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

    // Actualizar la contraseña en la base de datos
    await user.update({ password: hashedPassword });

    res.json({ 
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ 
      message: 'Error al actualizar contraseña',
      error: error.message 
    });
  }
});

// Ruta temporal para listar usuarios (remover en producción)
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'password'] // Incluimos password temporalmente para diagnóstico
    });
    const safeUsers = users.map(user => ({
      ...user.toJSON(),
      password: {
        length: user.password.length,
        preview: user.password.substring(0, 10) + '...',
        format: 'md5'
      }
    }));
    res.json(safeUsers);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
});

// Ruta temporal para actualizar el hash de la contraseña (remover en producción)
router.post('/rehash-password', async (req, res) => {
  try {
    const { usuario, oldPassword } = req.body;
    
    if (!usuario || !oldPassword) {
      return res.status(400).json({ 
        message: 'Usuario y contraseña actual son requeridos' 
      });
    }

    const user = await User.findOne({ 
      where: { username: usuario } 
    });

    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }
/*
    // Verificar si la contraseña sin hash coincide con la almacenada
    if (oldPassword === 'xdevfabian' && 
        user.password === '5fa4452acea7a0ed441c4d509420a693') {
      // La contraseña coincide, vamos a actualizarla con bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(oldPassword, salt);
      
      await user.update({ password: hashedPassword });
      
      console.log('Contraseña actualizada con hash bcrypt:', {
        oldHash: user.password,
        newHash: hashedPassword,
        //format: hashedPassword.startsWith('$2') ? 'bcrypt' : 'unknown'
      });

      res.json({ 
        message: 'Contraseña actualizada exitosamente con bcrypt' 
      });
    } else {
      res.status(401).json({ 
        message: 'Contraseña incorrecta' 
      });
    }

    */

  } catch (error) {
    console.error('Error al actualizar hash:', error);
    res.status(500).json({ 
      message: 'Error al actualizar hash',
      error: error.message 
    });

    
  }


});



// Ruta para registro de usuarios
router.post('/register', async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { username, email, password, role } = req.body;

    console.log('Received registration request:', {
      username,
      email,
      passwordLength: password ? password.length : 0,
      role
    });

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email y password son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El usuario o email ya está registrado' 
      });
    }

    console.log('Creating user:', {
      username,
      email
    });

    // Crear nuevo usuario - la contraseña será hasheada por el hook beforeCreate
    const user = await User.create({
      username,
      email,
      password: password,
      role: role || 'users'  // Si no se proporciona rol, será 'users' por defecto
    });

    console.log('User created successfully:', {
      id: user.id,
      username: user.username,
      hashedPasswordLength: user.password ? user.password.length : 0
    });

    // Generar token JWT para el nuevo usuario
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      }, 
      secret,
      { expiresIn: '24h' }
    );

    // Enviar respuesta exitosa
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ 
      message: 'Error al crear el usuario',
      error: error.message 
    });
  }
});

// Note: Removed duplicate login route

// Middleware de autenticación
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

// Ruta protegida de ejemplo
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role'] // Excluir password
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil',
      error: error.message 
    });
  }
});

module.exports = router;
