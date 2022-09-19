const { Meals } = require('../models/meals.model');
const { Orders } = require('../models/orders.model');
const { Restaurants } = require('../models/restaurants.model');
const { Reviews } = require('../models/reviews.model');
const { User } = require('../models/users.model');

const initModel = () => {


     //1 User <--------> M Order
     User.hasMany(Orders, { foreignKey: 'userId'});
     Orders.belongsTo(User);
 
     //1 User <--------> M Review
     User.hasMany(Reviews, {foreignKey: 'userId'});
     Reviews.belongsTo(User);
 
     //1 Restaurant <--------> M Review
     Restaurants.hasMany(Reviews, {foreignKey: 'restaurantId'});
     Reviews.belongsTo(Restaurants);
 
     //1 Restaurant <--------> M Meal
     Restaurants.hasMany(Meals, {foreignKey: 'restaurantId'})
     Meals.belongsTo(Restaurants)
 
     //1 Meals <--------> 1 Order
     Meals.hasOne(Orders, {foreignKey: 'mealId'});
     Orders.belongsTo(Meals);
 
};

module.exports = { initModel };
