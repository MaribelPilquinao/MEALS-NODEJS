const express = require('express');

// Controllers
const {
    getAllMeals,
    mealsById,
    createMeals,
    updateMeal,
    deleteMeal,
} = require('../controllers/meals.controller');

// Middlewares
const { mealExist } = require('../middlewares/meal.middlewares');
const {
    createMealsValidators,
} = require('../middlewares/validators.middlewares');
// --Auth
const {
    protectSession,
    protectAdmin,
} = require('../middlewares/auth.middlewares');

// Using routes
const mealsRouter = express.Router();

mealsRouter.get('/', getAllMeals);

mealsRouter.get('/:id',mealExist, mealsById);


// Endpoinds protected and admin
mealsRouter.use(protectSession);
mealsRouter.use(protectAdmin);

mealsRouter.post('/:id', createMealsValidators, createMeals);

mealsRouter.patch('/:id', mealExist, updateMeal);

mealsRouter.delete('/:id', mealExist, deleteMeal);

module.exports = { mealsRouter };
