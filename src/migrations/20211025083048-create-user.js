"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      avatarUrl: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      provider: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
