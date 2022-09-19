// Models
const {User } = require('../models/users.model')
// Utils
const { catchAsync } = require('../utils/CatchAsync.util')

const usersExist = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({
        attributes: { exclude: ['password']},
        where: { id }
    });

    // Verificar si existe el usuario
    if(!user) {
        return res.status(400).json({
            status: 'error',
            message: 'User not found'
        })
    }

    req.user = user;
    next();

})

module.exports = { usersExist }