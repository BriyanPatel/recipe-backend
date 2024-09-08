import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

// register user route with multer middleware to handle avatar and cover image uploads
router.route("/register").post( registerUser),
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt,logoutUser);
// secured routes
export default router;
