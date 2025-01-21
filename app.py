from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Replace with your MySQL username
app.config['MYSQL_PASSWORD'] = ''  # Replace with your MySQL password
app.config['MYSQL_DB'] = 'recipe_db'

mysql = MySQL(app)


# API: Fetch recipes based on ingredients
@app.route('/recipes', methods=['POST'])
def get_recipes():
    data = request.json
    ingredients = data.get('ingredients', [])
    dietary_info = data.get('dietary_info', [])
    
    if not ingredients:
        return jsonify({'error': 'No ingredients provided'}), 400

    # Generate SQL query dynamically based on provided ingredients and dietary preferences
    placeholders = ', '.join(['%s'] * len(ingredients))
    query = f"""
        SELECT r.id, r.name, r.description, r.difficulty, r.cooking_time, r.dietary_info
        FROM recipes r
        INNER JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        INNER JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE i.name IN ({placeholders})
        GROUP BY r.id
        HAVING COUNT(DISTINCT i.name) = %s
    """
    filters = dietary_info
    cursor = mysql.connection.cursor()
    cursor.execute(query, ingredients + [len(ingredients)])
    recipes = cursor.fetchall()

    result = []
    for recipe in recipes:
        result.append({
            'id': recipe[0],
            'name': recipe[1],
            'description': recipe[2],
            'difficulty': recipe[3],
            'cooking_time': recipe[4],
            'dietary_info': recipe[5],
        })

    return jsonify(result)


# API: Add a new recipe
@app.route('/recipes', methods=['POST'])
def add_recipe():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    difficulty = data.get('difficulty')
    cooking_time = data.get('cooking_time')
    dietary_info = ','.join(data.get('dietary_info', []))
    ingredients = data.get('ingredients', [])

    if not name or not ingredients:
        return jsonify({'error': 'Recipe name and ingredients are required'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO recipes (name, description, difficulty, cooking_time, dietary_info)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, description, difficulty, cooking_time, dietary_info))
    recipe_id = cursor.lastrowid

    for ingredient in ingredients:
        ingredient_name = ingredient['name']
        quantity = ingredient['quantity']

        # Add ingredient if not exists
        cursor.execute("INSERT IGNORE INTO ingredients (name) VALUES (%s)", (ingredient_name,))
        cursor.execute("SELECT id FROM ingredients WHERE name = %s", (ingredient_name,))
        ingredient_id = cursor.fetchone()[0]

        # Link recipe to ingredient
        cursor.execute("""
            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
            VALUES (%s, %s, %s)
        """, (recipe_id, ingredient_id, quantity))

    mysql.connection.commit()
    return jsonify({'message': 'Recipe added successfully'}), 201


# API: Save user feedback
@app.route('/feedback', methods=['POST'])
def add_feedback():
    data = request.json
    recipe_id = data.get('recipe_id')
    rating = data.get('rating')
    comment = data.get('comment')

    if not recipe_id or not rating:
        return jsonify({'error': 'Recipe ID and rating are required'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO user_feedback (recipe_id, rating, comment)
        VALUES (%s, %s, %s)
    """, (recipe_id, rating, comment))
    mysql.connection.commit()

    return jsonify({'message': 'Feedback added successfully'}), 201


# API: Fetch recipe details
@app.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM recipes WHERE id = %s", (recipe_id,))
    recipe = cursor.fetchone()

    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    cursor.execute("""
        SELECT i.name, ri.quantity
        FROM recipe_ingredients ri
        INNER JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = %s
    """, (recipe_id,))
    ingredients = cursor.fetchall()

    ingredient_list = [{'name': ing[0], 'quantity': ing[1]} for ing in ingredients]

    return jsonify({
        'id': recipe[0],
        'name': recipe[1],
        'description': recipe[2],
        'difficulty': recipe[3],
        'cooking_time': recipe[4],
        'dietary_info': recipe[5],
        'ingredients': ingredient_list
    })


if __name__ == '__main__':
    app.run(debug=True)
