import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipeDetails, submitFeedback } from "../services/api";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const recipeDetails = await fetchRecipeDetails(recipeId);
      setRecipe(recipeDetails);
    };
    fetchData();
  }, [recipeId]);

  const handleFeedback = async () => {
    await submitFeedback(recipeId, rating, comment);
    alert("Feedback submitted!");
    setRating(0);
    setComment("");
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-details">
      <h2>{recipe.name}</h2>
      <p>{recipe.description}</p>
      <p>Difficulty: {recipe.difficulty}</p>
      <p>Cooking Time: {recipe.cooking_time} min</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ing, index) => (
          <li key={index}>
            {ing.name}: {ing.quantity}
          </li>
        ))}
      </ul>
      <h3>Leave Feedback</h3>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rating (1-5)"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment"
      />
      <button onClick={handleFeedback}>Submit</button>
    </div>
  );
};

export default RecipeDetails;
