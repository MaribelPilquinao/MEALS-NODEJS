const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Restaurants } = require('../models/restaurants.model');
const { User } = require('../models/users.model');
const { Meals } = require('../models/meals.model');
const { Reviews } = require('../models/reviews.model');

// Utils
const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config();

const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurants.create({
        name,
        address,
        rating,
    });

    res.status(201).json({
        status: 'success',
        data: { newRestaurant },
    });
});
const getAllRestaurants = catchAsync(async (req, res, next) => {
   

    const restaurant = await Restaurants.findAll({
        where: {status: 'active'},
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Reviews,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    required: false,
                    where: { status: 'active' },
                    attributes: ['id', 'name', 'email'],
                },
            },
            {
                model: Meals,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'name', 'price'],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurants.findOne({
        where: { id, status: 'active' },
        attributes: ['id', 'name', 'address', 'rating'],
        include: [
            {
                model: Meals,
                required: false,
                attributes: ['id', 'name', 'price'],
            },
            {
                model: Reviews,
                required: false,
                attributes: [
                    'id',
                    'userId',
                    'restaurantId',
                    'comment',
                    'rating',
                ],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
    const { name, address } = req.body;
    const { restaurant } = req;

    await restaurant.update({ name, address });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant } = req;

    await restaurant.update({ status: 'deleted' });

    res.status(200).json({
        status: 'success',
    });
});

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};
