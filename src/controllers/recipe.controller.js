import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Recipe } from "../models/recipe.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

function getRandomElements(arr, count, arrayA, arrayB) {
  // Shuffle the array
  const shuffled = arr.sort(() => Math.random() - 0.5);

  // Try to get a valid result
  for (let i = 0; i < 10; i++) {
    // Try multiple times to find a valid result
    const selected = shuffled.slice(0, count);
    const hasElementFromA = selected.some((item) => arrayA.includes(item));
    const hasElementFromB = selected.some((item) => arrayB.includes(item));

    if (hasElementFromA && hasElementFromB) {
      return selected;
    }
  }

  // Fallback if not found (should not happen if arrays are large enough)
  return shuffled.slice(0, count);
}
// Search recipes
const searchRecipes = asyncHandler(async (req, res) => {

  // get ingredient from query
  const { ingredient } = req.query;

  // get user
  const user = await User.findById(req.user._id);

  // add ingredient to user search prefrence
  const usersIngredient = user.searchPrefrence;
  usersIngredient.unshift(ingredient);
  usersIngredient.pop();
  await User.findByIdAndUpdate(
    req.user._id,
    {
      searchPrefrence: usersIngredient,
    },
    { new: true }
  );

  // get recipes
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching Recipe"));
  }
});

// Random recipes
const randomRecipes = asyncHandler(async (req, res) => {
  try {
    const basicIngredient = [
      "Apple",
      "Banana",
      "Mango",
      "Cherry",
      "Musk melon",
      "Pineapple",
      "Strawberry",
    ];
    const currentUser = await User.findById(req.user._id);
    const usersIngredient = currentUser.searchPrefrence;

    // Combine both
    const combined = [...basicIngredient, ...usersIngredient];

    // Get 3 random ingridients
    const randomIngridient = await getRandomElements(
      combined,
      3,
      basicIngredient,
      usersIngredient
    );

    // Get recipes
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${JSON.stringify(
        randomIngridient
      )}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching Recipe"));
  }
});

// Save recipe
const saveRecipe = asyncHandler(async (req, res) => {
  const { recipeData } = req.body;
  console.log(recipeData);
  try {
    const recipe = new Recipe(recipeData);
    await recipe.save();
    const savedRecipe = await Recipe.findOne({ title: recipeData.title });

    const user = await User.findById(req.user._id);
    user.favoriteRecipes.push(recipe._id);
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, savedRecipe, "Recipe saved successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

// Get favorite recipes
const getFavoriteRecipes = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "favoriteRecipes",
        options: {
          // Pagination parameters
          skip: parseInt(req?.query?.page) * parseInt(req?.query?.limit) || 0,
          limit: parseInt(req?.query?.limit) || 10,
          sort: { createdAt: -1 }, // Optional: sort by creation date descending
        },
      })
      .exec();

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

// Add rating
const addRating = asyncHandler(async (req, res) => {
  try {
    // Get recipe and user
    const { rating } = req.body; // Should be a number between 1-5
    const recipe = await Recipe.findById(req.params.id);
    const user = await req.user._id; // assuming the user is authenticated

    // Check if user has already rated
    const existingRating = recipe.ratings.find(
      (r) => r.user.toString() === user.toString()
    );
    // Add or update rating
    if (existingRating) {
      existingRating.rating = rating; // Update the existing rating
    } else {
      recipe.ratings.push({ user, rating });
    }
    console.log(recipe.ratings, "asdasd");
    // Recalculate average rating
    await recipe.calculateAverageRating();
    await recipe.save();

    // Return response
    res
      .status(200)
      .json({ message: "Rating added", averageRating: recipe.averageRating });

    // Error handling
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
const addReview = asyncHandler(async (req, res) => {
  try {
    // Get recipe and user
    const { review } = req.body;
    if (!review) {
      return res.status(400).json({ message: "No review provided" });
    }
    const recipe = await Recipe.findById(req.params.id);
    const user = req.user._id;

    // Add review
    recipe.reviews.push({ user, review });
    await recipe.save();

    // Return response
    res.status(200).json({ message: "Review added", reviews: recipe.reviews });

    // Error handling
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export {
  searchRecipes,
  saveRecipe,
  getFavoriteRecipes,
  addRating,
  addReview,
  randomRecipes,
};
