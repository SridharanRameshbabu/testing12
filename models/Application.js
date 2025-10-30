const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },
  college: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
  },
  domain: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.INTEGER,
  },
  message: {
    type: DataTypes.TEXT,
  },
  resume_filename: {
    type: DataTypes.STRING,
  },
  resume_mimetype: {
    type: DataTypes.STRING,
  },
  resume_size: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Application;
