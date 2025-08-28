const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Destination = sequelize.define('Destination', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Destination;
