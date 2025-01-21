import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RecipeList.css";

const RecipeList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recipes = state?.recipes || [];

  return (
    <div className="recipe-list">
      <h2>Matching Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes found. Try different ingredients.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} onClick={() => navigate(`/recipes/${recipe.id}`)}>
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <p>
                Difficulty: {recipe.difficulty} | Time: {recipe.cooking_time} min
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;
