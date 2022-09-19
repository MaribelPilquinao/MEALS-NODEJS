const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Models
const { Orders } = require('../models/orders.model');
const { Restaurants } = require('../models/restaurants.model');
const { Meals } = require('../models/meals.model');

const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config();

const createOrder = catchAsync(async (req, res, next) => {

    const { sessionUser } = req; 

    const { quantity, mealId } = req.body;

    const meal = await Meals.findOne({
        where: { id: mealId, status: 'active' },
    });

    if (!meal) {
        return next(new AppError(404,'Meal not found'));
    }

    const newOrder = await Orders.create({
        mealId,
        userId: sessionUser.id,
        totalPrice: quantity * meal.price,
        quantity,
    });

    res.status(201).json({
        status: 'success',
        data: { newOrder },
    });
});

const getOrdersUser = catchAsync(async (req, res, next) => {
    const order = await Orders.findAll({
        where: {
            userId: sessionUser.id,
        },
        include: [
            {
                model: Meals,
                attributes: {
                    exclude: ['status'],
                },
                include: [
                    {
                        model: Restaurants,
                        attributes: {
                            exclude: ['status'],
                        },
                    },
                ],
            },
        ],
    });

    res.json({
        status: 'success',
        data: { order },
    });
});

const updateOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    await order.update({ status: 'completed' });

    res.status(200).json({
        status: 'success',
        order,
    });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    await order.update({ status: 'cancelled' });

    res.status(204).json({ status: 'success' });
});

module.exports = { getOrdersUser, createOrder, updateOrder, deleteOrder };
