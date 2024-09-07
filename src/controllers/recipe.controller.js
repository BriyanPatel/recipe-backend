import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Recipe } from "../models/recipe.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
const searchRecipes = asyncHandler(async (req, res) => {
  const { ingredient } = req.query;
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching Recipe"));
  }
});

const saveRecipe = asyncHandler(async (req, res) => {
  const { recipeData } = req.body;
  try {
    const recipe = new Recipe(recipeData);
    await recipe.save();

    const user = await User.findById(req.user._id);
    user.favoriteRecipes.push(recipe._id);
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, recipe, "Recipe saved successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getFavoriteRecipes = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favoriteRecipes").exec();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user.favoriteRecipes,
          "Recipes fetched successfully"
        )
      );
  } catch (error) {
    res.status(500).json(error);
  }
});

export { 
    searchRecipes, 
    saveRecipe, 
    getFavoriteRecipes };
