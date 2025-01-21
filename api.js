import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export const fetchRecipes = async (ingredients, dietaryInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recipes`, {
      ingredients,
      dietary_info: dietaryInfo,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const fetchRecipeDetails = async (recipeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
};

export const submitFeedback = async (recipeId, rating, comment) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback`, {
      recipe_id: recipeId,
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return null;
  }
};
