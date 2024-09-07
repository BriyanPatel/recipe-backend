import { Router } from "express";
import {
  searchRecipes,
  saveRecipe,
  getFavoriteRecipes,
} from "../controllers/recipe.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/search").get(searchRecipes);
router.route("/save").post(verifyJwt, saveRecipe);
router.route("/favorites").get(verifyJwt, getFavoriteRecipes);

// secured routes
export default router;
