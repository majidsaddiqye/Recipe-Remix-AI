const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    ingredientsHash: { type: String, required: true, index: true }, // For Caching
    title: { type: String, required: true },
    ingredients: [String],
    instructions: [String],
    nutrition: {
      calories: Number,
      protein: String,
      carbs: String,
      fat: String,
    },
    cuisine: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    recipeContent: { type: String }, // Store markdown content from chat
  },
  { timestamps: true }
);

const recipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = recipeModel;
