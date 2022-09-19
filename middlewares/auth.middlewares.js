const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Model
const { User } = require('../models/users.model');

const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
    // Token
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(403).json({
            status: 'success',
            message: 'Invalid session',
        });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
        where: { id: decoded.id, status: 'active' },
    });

    if (!user) {
        return res.status(403).json({
            status: 'error',
            message: 'The owner of the session is no longer active',
        });
    }

    req.sessionUser = user;
    next();
});

const protectReviewOwners = (req, res, next) => {
    const { sessionUser, review } = req;

    if (sessionUser.id !== review.userId) {
        return next(new AppError(403, 'This review does not belong to you.'));
    }

    next();
};

const protectAdmin = (req, res, next) => {
    const { sessionUser } = req;

    if (sessionUser.role !== 'admin') {
        return next(
            new AppError(403, 'You do not have the access level for this data.')
        );
    }

    next();
};

const protectUsersAccount = (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
        return next(
            new AppError(403, 'You are not the owner of this account.')
        );
    }

    next();
};

const protectOrderOwner = (req, res, next) => {
    const { sessionUser, order } = req;

    if (sessionUser.id !== order.userId) {
        return next(new AppError(403, 'This order does not belong to you.'));
    }

    next();
};

module.exports = {
    protectSession,
    protectReviewOwners,
    protectAdmin,
    protectUsersAccount,
    protectOrderOwner,
};
