import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

// register user route with multer middleware to handle avatar and cover image uploads
router.route("/register").post( registerUser),
// login user route
router.route("/login").post(loginUser);

// secured routes
export default router;
