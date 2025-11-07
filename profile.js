// models/profile.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite' });

const Profile = sequelize.define('Profile', {
  name: { type: DataTypes.STRING },
  url: { type: DataTypes.STRING, allowNull: false },
  about: { type: DataTypes.TEXT },
  bio: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  follower_count: { type: DataTypes.INTEGER },
  connection_count: { type: DataTypes.STRING }, // LinkedIn often shows "500+" etc
  bio_line: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = { sequelize, Profile };
