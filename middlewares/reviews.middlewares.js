// Models
const { Reviews } = require('../models/reviews.model');
// utils
const { AppError } = require('../utils/appError.util');

const reviewExist = async (req, res, next) => {
    const { id } = req.params;
    const review = await Reviews.findOne({ where: { id, status: 'active' } });

    if (!review) return next(new AppError(404, 'Bad request'));

    req.review = review;
    next();
};

const userAlreadyMadeReview = async (req, res, next) => {
    const { sessionUser } = req;
    const { id } = req.params;
    const review = await Reviews.findOne({
        where: { restaurantId: id, userId: sessionUser.id },
    });

    if (review)
        return next(
            new AppError(401, 'The user already made a restaurant review')
        );

    next();
};

module.exports = { reviewExist, userAlreadyMadeReview };
