const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class users extends Model {
  async comparePassword(candidatePassword) {
    const storedHash = this.password;
    
    // Check if it's an old MD5 hash (32 chars, hex)
    const isMD5Format = /^[a-f0-9]{32}$/i.test(storedHash);
    
    console.log('Comparing passwords:', {
      storedPasswordFormat: isMD5Format ? 'MD5' : storedHash.startsWith('$2') ? 'bcrypt' : 'unknown',
      storedLength: storedHash.length,
      candidateLength: candidatePassword.length
    });

    let isValid = false;

    if (isMD5Format) {
      // If it's MD5, verify using MD5 and upgrade to bcrypt if valid
      const crypto = require('crypto');
      const md5Hash = crypto.createHash('md5').update(candidatePassword).digest('hex');
      isValid = md5Hash === storedHash;
      
      if (isValid) {
        // Upgrade to bcrypt
        const salt = await bcrypt.genSalt(10);
        const bcryptHash = await bcrypt.hash(candidatePassword, salt);
        await this.update({ password: bcryptHash });
        console.log('Password auto-upgraded from MD5 to bcrypt');
      }
    } else {
      // Try bcrypt verification
      isValid = await bcrypt.compare(candidatePassword, storedHash);
    }

    return isValid;
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
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'users',
  // Deshabilitar timestamps ya que la tabla no tiene las columnas createdAt y updatedAt
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = users;


