"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true,
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING(20),
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      avatarUrl: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
