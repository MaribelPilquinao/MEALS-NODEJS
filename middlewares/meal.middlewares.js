const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');
const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');
const { response } = require('express');

const mealExist = catchAsync(async (req, res = response, next) => {
    const { id } = req.params;

    const meal = await Meals.findOne({
        where: {
            id,
            status: true,
        },
        attributes: { exclude: ['status'] },
        include: [
            {
                model: Restaurants,
                attributes: {
                    exclude: ['status'],
                },
            },
        ],
    });

    if (!meal) {
        return next(new AppError('The meal is not found', 404));
    }

    req.meal = meal;

    next();
});

module.exports = { mealExist };
