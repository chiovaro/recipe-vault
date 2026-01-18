import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../services/recipe.service';

interface IngredientItem {
  text: string;
  checked: boolean;
}

@Component({
  selector: 'app-recipe-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-display.component.html',
  styleUrl: './recipe-display.component.scss'
})
export class RecipeDisplayComponent implements OnInit, OnChanges {
  @Input() recipe: Recipe | null = null;
  ingredients: IngredientItem[] = [];

  private cleanIngredientText(text: string): string {
    // Remove checkbox symbols (☐, ☑, □, ☒)
    return text.replace(/^[\s☐☑□☒]+/, '').trim();
  }

  ngOnInit(): void {
    this.initializeIngredients();
  }

  ngOnChanges(): void {
    this.initializeIngredients();
  }

  private initializeIngredients(): void {
    if (this.recipe) {
      this.ingredients = this.recipe.ingredients.map(ing => ({
        text: this.cleanIngredientText(ing),
        checked: false
      }));
    }
  }
}
