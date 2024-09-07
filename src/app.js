import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser());

// routes import
import  userRouter from "./routes/user.routes.js";
import recipeRouter from "./routes/recipe.routes.js"
// route implementations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipes", recipeRouter);
export { app };
