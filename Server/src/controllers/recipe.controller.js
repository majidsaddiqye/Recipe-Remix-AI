const Recipe = require("../models/recipe.model");
const userModel = require('../models/user.model')
const { generateRecipeFromOpenAI } = require("../services/ai.service");

exports.getRecipe = async (req, res) => {
  try {
    const { ingredients, cuisine } = req.body;
    const dietaryRestrictions = req.user.dietaryPreferences || [];

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients are required" });
    }

    // 1. Create unique hash for Caching (Sorted ingredients)
    const hash = ingredients.map(i => i.toLowerCase().trim()).sort().join(",");

    // 2. Check Cache in MongoDB
    const cachedRecipe = await Recipe.findOne({ ingredientsHash: hash, cuisine });
    if (cachedRecipe) {
      return res.status(200).json({ source: "cache", data: cachedRecipe });
    }

    // 3. Call Gemini AI if not in cache
    const aiResponse = await generateRecipeFromOpenAI(ingredients, cuisine, dietaryRestrictions);

    // 4. Save to Database (Cache & Reference)
    const newRecipe = await Recipe.create({
      ingredientsHash: hash,
      ...aiResponse,
      cuisine,
      createdBy: req.user._id
    });

    res.status(201).json({ source: "ai", data: newRecipe });

  } catch (error) {
    console.error("Recipe Error:", error);
    res.status(500).json({ message: "Error generating recipe", error: error.message });
  }
};

exports.saveRecipe = async (req, res) => {
    try {
      const { recipeId, recipeData } = req.body;
      
      let recipeIdToSave = recipeId;
      
      // If recipeData is provided (from chat), create a new recipe first
      if (recipeData && !recipeId) {
        const newRecipe = await Recipe.create({
          title: recipeData.title || "Saved Recipe",
          ingredientsHash: recipeData.ingredientsHash || `chat-${Date.now()}-${req.user._id}`,
          ingredients: recipeData.ingredients || [],
          instructions: recipeData.instructions || [],
          nutrition: recipeData.nutrition || {},
          cuisine: recipeData.cuisine || "",
          createdBy: req.user._id,
          recipeContent: recipeData.recipeContent || recipeData.content || "", // Store markdown content
        });
        recipeIdToSave = newRecipe._id;
      }
      
      if (!recipeIdToSave) {
        return res.status(400).json({ message: "Recipe ID or Recipe Data is required" });
      }
      
      // User ki savedRecipes array mein ID push (if not already there)
      await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { savedRecipes: recipeIdToSave }
      });
  
      res.status(200).json({ message: "Recipe saved successfully", recipeId: recipeIdToSave });
    } catch (error) {
        console.log("Failed to Saved Receipe :", error)
      res.status(500).json({ message: error.message });
    }
  };

  exports.getSavedRecipes = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id).populate('savedRecipes');
      res.status(200).json({ data: user.savedRecipes });
    } catch (error) {
        console.log("get SavedReceipe error :",error)
      res.status(500).json({ message: error.message });
    }
  };

  exports.removeSavedRecipe = async (req, res) => {
    try {
      const { recipeId } = req.params;
      
      // Remove recipeId from user's savedRecipes array
      await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { savedRecipes: recipeId }
      });
  
      res.status(200).json({ message: "Recipe removed successfully" });
    } catch (error) {
      console.log("Failed to remove recipe:", error);
      res.status(500).json({ message: error.message });
    }
  };