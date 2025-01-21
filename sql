CREATE DATABASE recipe_db;

USE recipe_db;

-- Table for storing recipes
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty ENUM('Easy', 'Medium', 'Hard'),
    cooking_time INT, -- in minutes
    dietary_info VARCHAR(255) -- e.g., 'vegetarian, gluten-free'
);

-- Table for storing ingredients
CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Recipe-to-ingredient mapping
CREATE TABLE recipe_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Table for user feedback
CREATE TABLE user_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    rating INT, -- 1-5 stars
    comment TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
