const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  alertName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instanceId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.ENUM('ALARM', 'OK', 'INSUFFICIENT_DATA'),
    allowNull: false,
    defaultValue: 'ALARM'
  },
  resolvedBy: {
    type: DataTypes.STRING
  },
  resolvedAt: {
    type: DataTypes.DATE
  },
  rawData: {
    type: DataTypes.JSONB
  }
}, {
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['instanceId']
    },
    {
      fields: ['accountId']
    },
    {
      fields: ['state']
    }
  ]
});

module.exports = Alert;
