import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-scraper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-scraper.component.html',
  styleUrl: './recipe-scraper.component.scss'
})
export class RecipeScraperComponent {
  @Output() recipeSaved = new EventEmitter<Recipe>();

  recipeUrl: string = '';
  loading: boolean = false;
  error: string | null = null;
  scrapedRecipe: Recipe | null = null;
  saving: boolean = false;

  constructor(private recipeService: RecipeService) {}

  scrapeRecipe(): void {
    if (!this.recipeUrl.trim()) {
      this.error = 'Please enter a recipe URL';
      return;
    }

    this.loading = true;
    this.error = null;
    this.scrapedRecipe = null;

    this.recipeService.scrapeRecipe(this.recipeUrl).subscribe({
      next: (recipe) => {
        this.loading = false;
        this.scrapedRecipe = recipe;
        console.log('Recipe scraped:', recipe);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to scrape recipe';
        console.error('Error scraping recipe:', error);
      }
    });
  }

  saveRecipe(): void {
    if (!this.scrapedRecipe) return;

    this.saving = true;
    this.recipeService.saveRecipe(this.scrapedRecipe).subscribe({
      next: () => {
        this.saving = false;
        this.recipeSaved.emit(this.scrapedRecipe!);
        this.scrapedRecipe = null;
        this.recipeUrl = '';
        this.error = null;
      },
      error: (error) => {
        this.saving = false;
        this.error = 'Failed to save recipe';
        console.error('Error saving recipe:', error);
      }
    });
  }
}
