# Recipe Vault

A web application for scraping recipe URLs and extracting ingredients, instructions, title, and images from recipe websites.

## Features

- **Recipe Scraper**: Submit a recipe URL to automatically extract:
  - Recipe title
  - Ingredient list
  - Step-by-step instructions
  - Recipe image
  
- **Recipe Vault**: View and manage your saved recipes
- **Bootstrap UI**: Responsive and professional interface
- **Web Scraping**: Powered by Cheerio and Axios on the backend

## Technology Stack

### Frontend
- **Angular 18+**: Modern web framework
- **Bootstrap 5**: Responsive UI components
- **TypeScript**: Type-safe development
- **SCSS**: Enhanced styling

### Backend
- **Node.js & Express**: RESTful API server
- **Cheerio**: HTML parsing and web scraping
- **Axios**: HTTP client for fetching webpages
- **CORS**: Cross-Origin Resource Sharing support

## Project Structure

```
recipe-vault/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── recipe-scraper/       # URL input and scraping component
│   │   │   ├── recipe-display/       # Display scraped recipe details
│   │   │   └── recipe-vault/         # Saved recipes list
│   │   ├── services/
│   │   │   └── recipe.service.ts     # API communication service
│   │   ├── app.component.*           # Main application component
│   │   └── app.config.ts             # Angular configuration
│   ├── styles.scss                   # Global styles
│   └── main.ts                       # Application entry point
├── server/
│   ├── package.json                  # Server dependencies
│   └── index.js                      # Express API server
├── dist/                             # Built frontend (generated)
├── angular.json                      # Angular CLI configuration
├── package.json                      # Frontend dependencies
└── tsconfig.json                     # TypeScript configuration
```

## Installation

### Prerequisites
- Node.js v18+ and npm

### Frontend Setup
```bash
cd recipe-vault
npm install
```

### Backend Setup
```bash
cd recipe-vault/server
npm install
```

## Running the Application

### Start the Backend API (in one terminal)
```bash
cd recipe-vault/server
npm start
```
The API will run on `http://localhost:3000`

Health check: `http://localhost:3000/health`

### Start the Angular Development Server (in another terminal)
```bash
cd recipe-vault
ng serve
```
The application will be available at `http://localhost:4200`

## Building for Production

### Build Frontend
```bash
cd recipe-vault
npm run build
```
Output will be in `dist/recipe-vault/`

### Production Deployment Notes
When deploying to production (zachio.com):
1. Build the Angular frontend with `npm run build`
2. Configure the backend API URL in `src/app/services/recipe.service.ts`
3. Deploy the server to your hosting environment
4. Serve the built Angular app through a web server

## API Endpoints

### Scrape Recipe
**POST** `/api/scrape`
```json
{
  "url": "https://example.com/recipe-url"
}
```
Returns scraped recipe data with title, ingredients, instructions, and image.

### Get All Recipes
**GET** `/api/scrape/recipes`
Returns array of all saved recipes.

### Save Recipe
**POST** `/api/scrape/save`
```json
{
  "recipe": { /* recipe object */ }
}
```

### Delete Recipe
**DELETE** `/api/scrape/recipes/:id`
Deletes a recipe by URL.

## Notes

- Recipe scraping uses generic HTML selectors and works best with standard recipe websites
- Some websites may require specific selectors; you can customize the scraping logic in `server/index.js`
- The backend uses an in-memory database; for production, connect to a real database (MongoDB, PostgreSQL, etc.)
- CORS is enabled for local development; adjust for production

## Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication and accounts
- [ ] Enhanced recipe parsing with site-specific adapters
- [ ] Recipe search and filtering
- [ ] Recipe notes and ratings
- [ ] Export recipes as PDF
- [ ] Mobile app with React Native

## Hosting on zachio.com

To host on your domain:
1. Build the Angular frontend
2. Set up Node.js on your hosting environment
3. Configure your domain to point to the server
4. Use environment variables for API configuration
5. Consider using PM2 or similar to run the Node.js server in production

## License

MIT

## Support

For issues or questions, contact: info@zachio.com

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
