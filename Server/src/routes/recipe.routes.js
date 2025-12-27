const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { authUser } = require('../middlewares/auth.middleware');

// Protected Route: 
router.post('/generate', authUser, recipeController.getRecipe);
router.post('/save', authUser, recipeController.saveRecipe);
router.get('/my-recipes', authUser, recipeController.getSavedRecipes);
router.delete('/remove/:recipeId', authUser, recipeController.removeSavedRecipe);

module.exports = router;