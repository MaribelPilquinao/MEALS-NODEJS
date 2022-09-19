// Model
const { Restaurants } = require('../models/restaurants.model');

// Utils
const { catchAsync } = require('../utils/CatchAsync.util');

const restaurantExist = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const restaurant = await Restaurants.findOne({ where: { id } });

    if (!restaurant) {
        return res.status(400).json({
            status: 'error',
            message: 'Restaurant not found',
        });
    }

    req.restaurant = restaurant;
    next();
});

module.exports = { restaurantExist };
