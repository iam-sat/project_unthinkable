import React, { useState } from "react";
import { fetchRecipes } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [ingredients, setIngredients] = useState("");
  const [dietaryInfo, setDietaryInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    const ingredientList = ingredients.split(",").map((item) => item.trim());
    const recipes = await fetchRecipes(ingredientList, dietaryInfo);
    setLoading(false);
    navigate("/recipes", { state: { recipes } });
  };

  return (
    <div className="home">
      <h2>Enter Your Ingredients</h2>
      <textarea
        placeholder="Enter ingredients separated by commas (e.g., tomato, cheese, pasta)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <div>
        <label>
          <input
            type="checkbox"
            value="vegetarian"
            onChange={(e) =>
              setDietaryInfo((prev) =>
                e.target.checked
                  ? [...prev, e.target.value]
                  : prev.filter((item) => item !== e.target.value)
              )
            }
          />
          Vegetarian
        </label>
        <label>
          <input
            type="checkbox"
            value="gluten-free"
            onChange={(e) =>
              setDietaryInfo((prev) =>
                e.target.checked
                  ? [...prev, e.target.value]
                  : prev.filter((item) => item !== e.target.value)
              )
            }
          />
          Gluten-Free
        </label>
      </div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Find Recipes"}
      </button>
    </div>
  );
};

export default Home;
