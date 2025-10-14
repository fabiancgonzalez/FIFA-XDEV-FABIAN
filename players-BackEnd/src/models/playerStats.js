const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class PlayerStats extends Model {}

PlayerStats.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Players',
      key: 'id'
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skill: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'PlayerStats',
  timestamps: false
});

module.exports = PlayerStats;