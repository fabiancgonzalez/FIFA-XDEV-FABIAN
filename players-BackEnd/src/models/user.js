const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class users extends Model {
  async comparePassword(candidatePassword) {
    try {
      if (!this.password || !candidatePassword) {
        console.error('Falta contraseña para comparar:', {
          hasStoredPassword: !!this.password,
          hasCandidatePassword: !!candidatePassword
        });
        return false;
      }

      // Intentar verificar con bcrypt
      const isBcryptValid = await bcrypt.compare(candidatePassword, this.password);
      if (isBcryptValid) {
        console.log('Contraseña válida con bcrypt');
        return true;
      }

      // Intentar verificar con MD5
      const md5Hash = crypto.createHash('md5').update(candidatePassword).digest('hex');
      const isMD5Valid = md5Hash === this.password;

      if (isMD5Valid) {
        console.log('Contraseña válida con MD5. NO Migrando a bcrypt...');
        //const newHash = await bcrypt.hash(candidatePassword, 10);
       // await this.update({ password: newHash });

        console.log('Contraseña NO  actualizada a bcrypt:', {
          //oldHash: this.password,
         // newHash: newHash
        });

        return true;
      }

      console.log('Contraseña inválida: no coincide ni con bcrypt ni con MD5');
      return false;
    } catch (error) {
      console.error('Error en comparePassword:', error);
      return false;
    }
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
    beforeCreate: async (user) => {
      if (user.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Contraseña hasheada en beforeCreate:', {
            originalLength: user.password.length,
            hashedLength: user.password.length,
            isHashedWithBcrypt: user.password.startsWith('$2b$')
          });
        } catch (error) {
          console.error('Error al hashear contraseña en beforeCreate:', error);
          throw error;
        }
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Contraseña hasheada en beforeUpdate:', {
            hashFormat: user.password.startsWith('$2b$') ? 'bcrypt' : 'unknown',
            hashedLength: user.password.length
          });
        } catch (error) {
          console.error('Error al hashear contraseña en beforeUpdate:', error);
          throw error;
        }
      }
    }
  }
});

module.exports = users;






/*

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

class users extends Model {
  async comparePassword(candidatePassword) {
    try {
      console.log('Iniciando verificación de contraseña para:', {
        username: this.username,
        storedPassword: this.password,
        candidatePassword: candidatePassword
      });

      // Validaciones básicas
      if (!this.password || !candidatePassword) {
        console.error('Error en comparePassword: falta contraseña', {
          hasStoredPassword: !!this.password,
          hasCandidatePassword: !!candidatePassword
        });
        return false;
      }

      // Verificar contraseña directamente si coincide con el MD5 conocido
      if (this.username === 'fabian' && candidatePassword === 'xdevfabian') {
        if (this.password === '5fa4452acea7a0ed441c4d509420a693') {
          // Es el hash MD5 original, vamos a actualizarlo a bcrypt
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(candidatePassword, salt);
          
          console.log('Actualizando contraseña a bcrypt:', {
            oldHash: this.password,
            newHash: hashedPassword
          });

          await this.update({ password: hashedPassword });
          return true;
        }

        // Si la contraseña está en bcrypt, intentar verificar
        try {
          const newHash = await bcrypt.hash(candidatePassword, 10);

          const isValid = await bcrypt.compare(candidatePassword, this.password);
          const md5Hash = crypto.createHash('md5').update(candidatePassword).digest('hex');
          const isMD5 = md5Hash === this.password;
          //const newHash = await bcrypt.hash(candidatePassword, 10);
          //await this.update({ password: newHash }, { where: { id: this.id } });


          console.log('Verificación bcrypt:', {
            
            isValid: isValid,
         
          candidateHash: md5Hash,
            storedHash: this.password
          });

          if (isMD5) {
      // Actualizar a bcrypt si coincide
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(candidatePassword, salt);
      await this.update({ password: newHash });
  console.log('Verificación MD5:', {
      candidateHash: md5Hash,
      storedHash: this.password
    });

   console.log('Contraseña actualizada a bcrypt:', {
        oldHash: this.password,
        newHash: newHash
      });
          return isValid;

          //--------------------------------------------//
           // Intentar verificar con MD5
    

    }

    return false;



        } catch (bcryptError) {
          console.error('Error en verificación bcrypt:', bcryptError);
          
           console.log('La contraseña no coincide ni con bcrypt ni con MD5');
          return false;
        }
      }  
      console.log('La contraseña no coincide con el caso especial');
      return false;
    
   

   


    
    } catch (error) {
      console.error('Error en comparePassword:', error);
      return false;
    }



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
    beforeCreate: async (user) => {
      if (user.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Contraseña hasheada en beforeCreate:', {
            originalLength: user.password.length,
            hashedLength: user.password.length,
            isHashedWithBcrypt: user.password.startsWith('$2b$')
          });
        } catch (error) {
          console.error('Error al hashear contraseña en beforeCreate:', error);
          throw error;
        }
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Contraseña hasheada en beforeUpdate:', {
            hashFormat: user.password.startsWith('$2b$') ? 'bcrypt' : 'unknown',
            hashedLength: user.password.length
          });
        } catch (error) {
          console.error('Error al hashear contraseña en beforeUpdate:', error);
          throw error;
        }
      }
    }
  }
});

module.exports = users;

*/
