const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        ingredients TEXT[] NOT NULL,
        instructions TEXT[] NOT NULL,
        image VARCHAR(500),
        url VARCHAR(500) UNIQUE NOT NULL,
        scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Get all recipes
async function getAllRecipes() {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error getting recipes:', error);
    throw error;
  }
}

// Get recipe by ID
async function getRecipeById(id) {
  try {
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
}

// Save a recipe
async function saveRecipe(title, ingredients, instructions, image, url) {
  try {
    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, image, url) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (url) DO UPDATE SET scraped_at = CURRENT_TIMESTAMP RETURNING *',
      [title, ingredients, instructions, image, url]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
}

// Delete recipe by URL
async function deleteRecipe(url) {
  try {
    const result = await pool.query('DELETE FROM recipes WHERE url = $1 RETURNING *', [url]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  getAllRecipes,
  getRecipeById,
  saveRecipe,
  deleteRecipe
};
