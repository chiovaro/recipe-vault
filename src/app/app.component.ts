import { Component, ViewChild } from '@angular/core';
import { RecipeScraperComponent } from './components/recipe-scraper/recipe-scraper.component';
import { RecipeVaultComponent } from './components/recipe-vault/recipe-vault.component';
import { Recipe } from './services/recipe.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecipeScraperComponent, RecipeVaultComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'recipe-vault';
  @ViewChild(RecipeVaultComponent) vaultComponent!: RecipeVaultComponent;

  onRecipeSaved(recipe: Recipe): void {
    // Notify vault to refresh
    if (this.vaultComponent) {
      this.vaultComponent.loadRecipes();
    }
  }
}
