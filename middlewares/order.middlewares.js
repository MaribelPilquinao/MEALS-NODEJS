const { Orders } = require('../models/orders.model');
const { Meals } = require('../models/meals.model');
const { Restaurants } = require('../models/restaurants.model');
// utils
const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util')

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.sessionUser.id;

    const order = await Orders.findOne({
        where: { id, userId },
        attributes: ['id', 'totalPrice', 'quantity', 'status'],
        include: {
            model: Meals,
            attributes: ['id', 'name', 'price', 'status'],
            include: {
                model: Restaurants,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
        },
    });

    if (!order) {
        return next(new AppError(404, 'Order not found'));
    }

    req.order = order;
    next();
});

module.exports = { orderExists };
