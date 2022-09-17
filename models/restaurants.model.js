const { db, DataTypes } = require('../utils/database.util')

const Restaurants = db.define('restaurants', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addresS: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = { Restaurants };