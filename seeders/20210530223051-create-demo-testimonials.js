'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Testimonials', [{

      name: 'pedro',
      content: 'Donacion de ropa y productos no pedecederos',
      createdAt: new Date(),
      updatedAt: new Date()
    }],{});
    
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Testimonials', null, {});
    
  }
};
