import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService, Recipe } from '../../services/recipe.service';
import { RecipeDisplayComponent } from '../recipe-display/recipe-display.component';

@Component({
  selector: 'app-recipe-vault',
  standalone: true,
  imports: [CommonModule, RecipeDisplayComponent],
  templateUrl: './recipe-vault.component.html',
  styleUrl: './recipe-vault.component.scss'
})
export class RecipeVaultComponent implements OnInit {
  recipes: Recipe[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedRecipe: Recipe | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.error = null;

    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load recipes';
        this.loading = false;
        console.error('Error loading recipes:', error);
      }
    });
  }

  viewRecipe(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  }

  closeRecipe(): void {
    this.selectedRecipe = null;
    document.body.style.overflow = 'auto'; // Re-enable body scroll
  }

  deleteRecipe(id: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.recipes = this.recipes.filter(r => r.url !== id);
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          this.error = 'Failed to delete recipe';
        }
      });
    }
  }
}
