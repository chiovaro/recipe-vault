import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  image?: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api/scrape'; // Backend API endpoint

  constructor(private http: HttpClient) { }

  scrapeRecipe(url: string): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, { url });
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`);
  }

  saveRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/save`, { recipe });
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipes/${encodeURIComponent(id)}`);
  }
}
