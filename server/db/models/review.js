const Sequelize = require('sequelize');
const db = require('../db');

const Review = db.define('review', {
	content: {
		type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            len: [10, 50]
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    }
});

module.exports = Review;
