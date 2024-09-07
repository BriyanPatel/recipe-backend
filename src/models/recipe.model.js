import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  ingredients: { type: Array, required: true },
  image: { type: String },
  sourceUrl: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Recipe = mongoose.model("Recipe", recipeSchema);

