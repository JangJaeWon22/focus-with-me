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
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      avatarUrl: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
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
