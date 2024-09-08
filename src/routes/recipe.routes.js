import { Router } from "express";
import {
  searchRecipes,
  saveRecipe,
  getFavoriteRecipes,
  addReview,
  addRating,
  randomRecipes,
} from "../controllers/recipe.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/search").get(verifyJwt, searchRecipes);
router.route("/save").post(verifyJwt, saveRecipe);
router.route("/favorites").get(verifyJwt, getFavoriteRecipes);
router.route("/:id/review").post(verifyJwt, addReview);
router.route("/:id/rate").post(verifyJwt, addRating);
router.route("/randomRecipe").get(verifyJwt, randomRecipes);

export default router;
