# News Aggregator API

A Node.js RESTful API that aggregates news articles from multiple sources based on user preferences. Users can sign up, log in, set their news preferences, and receive personalized news feeds.

## Features

- User authentication (signup & login) with JWT
- Secure password storage with bcrypt
- User-specific news preferences (topics, keywords, etc.)
- Fetches news articles from [GNews API](https://gnews.io/)
- Protected endpoints for news and preferences

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB running locally or accessible via connection string

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anmolBan/news-aggregator-api-anmolBan.git
   cd news-aggregator-api-anmolBan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` or create a new `.env` file with the following:
     ```
     PORT=3000
     JWT_SECRET=your_jwt_secret
     NEWS_API_KEY=your_gnews_api_key
     MONGO_URI=your_mongodb_uri
     ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### User Routes

- `POST /users/signup`  
  Register a new user.  
  **Body:** `{ "email": "...", "password": "...", "name": "...", "preferences": ["..."] }`

- `POST /users/login`  
  Authenticate user and receive JWT token.  
  **Body:** `{ "email": "...", "password": "..." }`

- `GET /users/preferences`  
  Get current user's preferences.  
  **Headers:** `Authorization: Bearer <token>`

- `PUT /users/preferences`  
  Update user preferences.  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ "preferences": ["..."] }`

### News Routes

- `GET /news`  
  Get personalized news articles based on user preferences.  
  **Headers:** `Authorization: Bearer <token>`

## Example Usage

```bash
curl -X POST http://localhost:3000/users/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password","name":"Test User","preferences":["technology","sports"]}'
```

```bash
curl -X POST http://localhost:3000/users/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'
```

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/news
```

## License

MIT License
