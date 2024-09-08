import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  ingredients: { type: Array, required: true },
  image: { type: String },
  sourceUrl: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      review: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

/**
 * Calculates the average rating of this recipe by summing all the ratings
 * and dividing by the number of ratings. If there are no ratings, sets
 * the average rating to 0.
 */
recipeSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
};



export const Recipe = mongoose.model("Recipe", recipeSchema);
