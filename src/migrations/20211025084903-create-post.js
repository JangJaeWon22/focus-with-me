"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Posts", {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      categoryStudyMates: {
        type: Sequelize.STRING,
      },
      categoryInterests: {
        type: Sequelize.STRING,
      },
      imageContents: {
        type: Sequelize.STRING,
      },
      textContent: {
        type: Sequelize.STRING,
      },
      youtubeUrl: {
        type: Sequelize.STRING,
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Posts");
  },
};
