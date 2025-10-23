const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

class users extends Model {
  comparePassword(candidatePassword) {
    try {
      if (!this.password || !candidatePassword) {
        console.error('Falta contraseña para comparar:', {
          hasStoredPassword: !!this.password,
          hasCandidatePassword: !!candidatePassword
        });
        return false;
      }

      // Generar hash MD5 de la contraseña candidata
      const candidateHashMD5 = crypto.createHash('md5').update(candidatePassword).digest('hex');
      const isValid = candidateHashMD5 === this.password;

      console.log('Verificación de contraseña MD5:', {
        candidatePassword: candidatePassword,
        candidateHashMD5: candidateHashMD5,
        storedPassword: this.password,
        isValid: isValid
      });

      return isValid;
    } catch (error) {
      console.error('Error en comparePassword:', error);
      return false;
    }
  }

  // Método estático para hashear contraseñas con MD5
  static hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
  }
}

users.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'users'),
    defaultValue: 'users'
  }
}, {
  sequelize,
  modelName: 'users',
  // Deshabilitar timestamps ya que la tabla no tiene las columnas createdAt y updatedAt
  timestamps: false,
  hooks: {
    beforeCreate: (user) => {
      if (user.password) {
        user.password = crypto.createHash('md5').update(user.password).digest('hex');
        console.log('Contraseña hasheada con MD5 en beforeCreate:', {
          originalPassword: user.password,
          hashedPassword: user.password,
          hashedLength: user.password.length
        });
      }
    },
    beforeUpdate: (user) => {
      if (user.changed('password')) {
        user.password = crypto.createHash('md5').update(user.password).digest('hex');
        console.log('Contraseña hasheada con MD5 en beforeUpdate:', {
          hashedPassword: user.password,
          hashedLength: user.password.length
        });
      }
    }
  }
});

module.exports = users;
