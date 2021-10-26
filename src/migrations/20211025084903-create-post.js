"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Posts", {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      imageCover: {
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      categorySpace: {
        type: Sequelize.STRING,
      },
      categoryStudyMate: {
        type: Sequelize.STRING,
      },
      categoryInterest: {
        type: Sequelize.STRING,
      },
      imageContent: {
        type: Sequelize.STRING,
      },
      textContent: {
        type: Sequelize.STRING,
      },
      youtubeUrl: {
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Posts");
  },
};
