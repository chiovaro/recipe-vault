const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const { initializeDatabase, saveRecipe, getAllRecipes, deleteRecipe } = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// POST /api/scrape - Scrape a recipe from a URL
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Fetch the webpage
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Parse with Cheerio
    const $ = cheerio.load(data);

    // Generic selectors for common recipe sites
    let title = $('h1').first().text().trim() || 
                $('meta[property="og:title"]').attr('content') ||
                $('[data-recipe-title]').text().trim() ||
                $('title').text();
    
    let image = $('img').first().attr('src') ||
                $('[data-recipe-image]').attr('src') ||
                $('meta[property="og:image"]').attr('content');

    // Try to extract ingredients from multiple sources
    let ingredients = [];
    
    // 1. Try WPRM (WP Recipe Maker) format
    $('.wprm-recipe-ingredient').each((i, el) => {
      const text = $(el).text().trim();
      if (text) {
        ingredients.push(text);
      }
    });

    // 2. Try schema.org/Recipe format
    if (ingredients.length === 0) {
      $('[data-ingredient]').each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          ingredients.push(text);
        }
      });
    }

    // 3. Try common ingredient list selectors
    if (ingredients.length === 0) {
      $('.ingredient, .ingredients li, .recipe-ingredient, [class*="ingredient"]').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 3) {
          ingredients.push(text);
        }
      });
    }

    // 4. Fallback: get all list items and filter
    if (ingredients.length === 0) {
      $('li').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 5) {
          ingredients.push(text);
        }
      });
    }

    // If we still couldn't get ingredients, show message
    if (ingredients.length === 0) {
      ingredients = ['Ingredients could not be automatically extracted. Please check the original recipe.'];
    }

    // Try to extract instructions from multiple sources
    let instructions = [];

    // 1. Try WPRM format
    $('.wprm-recipe-instruction').each((i, el) => {
      const text = $(el).text().trim();
      if (text) {
        instructions.push(text);
      }
    });

    // 2. Try common instruction selectors
    if (instructions.length === 0) {
      $('ol li, .instructions li, .steps li, .recipe-instructions li, [class*="instruction"]').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 5) {
          instructions.push(text);
        }
      });
    }

    if (instructions.length === 0) {
      instructions = ['Instructions could not be automatically extracted. Please check the original recipe.'];
    }

    const recipe = {
      title: title || 'Unknown Recipe',
      ingredients: ingredients.slice(0, 20), // Limit to 20
      instructions: instructions.slice(0, 20), // Limit to 20
      image: image,
      url: url,
      scrapedAt: new Date()
    };

    // Save to database
    const savedRecipe = await saveRecipe(recipe.title, recipe.ingredients, recipe.instructions, recipe.image, recipe.url);
    res.json(savedRecipe);
  } catch (error) {
    console.error('Error scraping recipe:', error.message);
    res.status(500).json({ message: 'Failed to scrape recipe. Make sure the URL is valid.' });
  }
});

// GET /api/scrape/recipes - Get all saved recipes
app.get('/api/scrape/recipes', async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recipes' });
  }
});

// POST /api/scrape/save - Save a recipe to vault
app.post('/api/scrape/save', async (req, res) => {
  const { recipe } = req.body;
  
  if (!recipe) {
    return res.status(400).json({ message: 'Recipe is required' });
  }

  try {
    const savedRecipe = await saveRecipe(recipe.title, recipe.ingredients, recipe.instructions, recipe.image, recipe.url);
    res.json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error saving recipe' });
  }
});

// DELETE /api/scrape/recipes/:id - Delete a recipe
app.delete('/api/scrape/recipes/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await deleteRecipe(id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Recipe Vault API Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
