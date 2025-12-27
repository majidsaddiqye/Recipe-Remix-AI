# 🍳 Recipe Remix AI - Backend API

Professional AI-powered culinary assistant backend. Built with the **MERN Stack**, integrating **OpenAI GPT-4o-mini** for intelligent recipe generation and **Socket.io** for real-time persistent chat.

---

## 🚀 Core Functionalities

* **🔐 Secure Authentication:** Full JWT implementation with `HttpOnly` cookie-based sessions and password hashing using `Bcrypt`.
* **🤖 AI Recipe Engine:** Optimized OpenAI integration using **Structured JSON Mode** to provide parseable recipe data (title, ingredients, instructions, nutrition).
* **⚡ Smart Caching Layer:** MongoDB-based caching system that stores generated recipes to reduce API latency and minimize OpenAI token costs.
* **💬 Persistent Real-time Chat:** Seamless chat experience using **Socket.io**. Every conversation is stored in MongoDB, allowing users to resume chats after logout.
* **📂 Recipe Management:** Users can bookmark AI-generated recipes, viewing their personalized collection at any time.
* **🥗 Dietary Preferences:** Users can set and manage their dietary preferences (Vegan, Vegetarian, Gluten-Free, Keto, etc.), and AI considers these when generating recipes.
* **🛡️ Robust Error Handling:** Centralized error management with custom status codes for OpenAI Quota, Auth failures, and Database validation.

---

## 🏗 Tech Stack

| Technology | Usage |
| :--- | :--- |
| **Node.js / Express** | Backend Runtime & API Framework |
| **MongoDB / Mongoose** | Database & Document Modeling |
| **OpenAI API** | GPT-4o-mini for Recipe & Chat Logic |
| **Socket.io** | Real-time Bidirectional Communication |
| **JWT** | Secure User Authorization |
| **Bcrypt** | Password Hashing |
| **Cookie Parser** | HttpOnly Cookie Management |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**
- **OpenAI API Key** (Get it from [OpenAI Platform](https://platform.openai.com/))

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/majidsaddiqye/Recipe-Remix-AI.git
cd Recipe-Remix-AI/Server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `Server` directory:

```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/recipe-remix-ai
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/recipe-remix-ai

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 4. Start the Server

**Development Mode (with auto-reload):**
```bash
npm start
```

**Production Mode:**
```bash
node server.js
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### 1. Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "dietaryPreferences": ["Vegan", "Gluten-Free"] // Optional
}
```

**Response:**
```json
{
  "message": "User Registered Successfully",
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "dietaryPreferences": ["Vegan", "Gluten-Free"]
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User Login Successfully",
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```
*Note: JWT token is automatically set as HttpOnly cookie.*

#### Logout User
```http
POST /api/auth/logout
```
*Requires authentication cookie*

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

#### Update Dietary Preferences
```http
PUT /api/auth/dietary-preferences
Content-Type: application/json
Cookie: token=...
```

**Request Body:**
```json
{
  "dietaryPreferences": ["Vegan", "Gluten-Free", "Keto"]
}
```

**Response:**
```json
{
  "message": "Dietary preferences updated successfully",
  "data": {
    "user": {
      "_id": "...",
      "dietaryPreferences": ["Vegan", "Gluten-Free", "Keto"]
    }
  }
}
```

---

### 2. Recipe Engine (`/api/recipes`)

#### Generate Recipe
```http
POST /api/recipes/generate
Content-Type: application/json
Cookie: token=...
```

**Request Body:**
```json
{
  "ingredients": ["chicken", "rice", "onions", "tomatoes"],
  "cuisine": "Indian"
}
```

**Response:**
```json
{
  "source": "ai",
  "data": {
    "_id": "...",
    "title": "Chicken Biryani",
    "ingredients": ["chicken", "rice", "onions", "tomatoes", "..."],
    "instructions": ["Step 1", "Step 2", "..."],
    "nutrition": {
      "calories": 450,
      "protein": "30g",
      "carbs": "50g",
      "fat": "15g"
    },
    "cuisine": "Indian"
  }
}
```

#### Save Recipe
```http
POST /api/recipes/save
Content-Type: application/json
Cookie: token=...
```

**Request Body (Option 1 - Save existing recipe by ID):**
```json
{
  "recipeId": "recipe_id_here"
}
```

**Request Body (Option 2 - Save chat recipe):**
```json
{
  "recipeData": {
    "title": "Recipe Title",
    "ingredientsHash": "unique-hash",
    "ingredients": [],
    "instructions": ["Step 1", "Step 2"],
    "nutrition": {},
    "cuisine": "",
    "recipeContent": "Full markdown content"
  }
}
```

**Response:**
```json
{
  "message": "Recipe saved successfully",
  "recipeId": "..."
}
```

#### Get Saved Recipes
```http
GET /api/recipes/my-recipes
Cookie: token=...
```

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "Recipe Title",
      "ingredients": [...],
      "instructions": [...],
      "nutrition": {...},
      "recipeContent": "..."
    }
  ]
}
```

#### Remove Saved Recipe
```http
DELETE /api/recipes/remove/:recipeId
Cookie: token=...
```

**Response:**
```json
{
  "message": "Recipe removed successfully"
}
```

---

### 3. Real-time Chat (Socket.io Events)

**Connection:**
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true
});
```

#### Load Chat History
**Emit:**
```javascript
socket.emit("load_history", { userId: "user_id_here" });
```

**Listen:**
```javascript
socket.on("chat_history", (history) => {
  // history is an array of messages
  // [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
});
```

#### Send Message
**Emit:**
```javascript
socket.emit("send_msg", { 
  userId: "user_id_here", 
  text: "Mujhe chicken biryani ki recipe chahiye" 
});
```

**Listen:**
```javascript
socket.on("receive_msg", (msg) => {
  // msg = { role: "assistant", content: "AI response here" }
});
```

---

## 🗂️ Project Structure

```
Server/
├── src/
│   ├── controllers/       # Business logic handlers
│   │   ├── auth.controller.js
│   │   └── recipe.controller.js
│   ├── models/           # Database schemas
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   └── recipe.model.js
│   ├── routes/           # Express API endpoints
│   │   ├── auth.routes.js
│   │   ├── recipe.routes.js
│   │   └── chat.routes.js
│   ├── services/         # External service integrations
│   │   └── ai.service.js
│   ├── middlewares/      # Auth & validation layers
│   │   └── auth.middleware.js
│   ├── sockets/          # Real-time event management
│   │   └── socket.server.js
│   ├── db/               # Database connection
│   │   └── db.js
│   └── app.js            # Express app configuration
├── server.js             # Server entry point
├── package.json
└── .env                  # Environment variables (create this)
```

---

## 🔐 Authentication Flow

1. User registers/logs in → JWT token generated
2. Token stored as HttpOnly cookie (secure, not accessible via JavaScript)
3. Protected routes check for token in cookies
4. Middleware validates token and attaches user to `req.user`
5. User data available in all protected route handlers

---

## 🤖 AI Integration

### Recipe Generation
- Uses OpenAI GPT-4o-mini with **Structured JSON Mode**
- Considers user's dietary preferences automatically
- Caches recipes in MongoDB to reduce API calls
- Returns parseable JSON with title, ingredients, instructions, nutrition

### Chat Responses
- Uses OpenAI GPT-4o-mini in conversational mode
- Maintains context from last 10 messages
- Incorporates user's dietary preferences in system prompt
- Provides natural, friendly responses in user's language

---

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  dietaryPreferences: [String] (default: []),
  savedRecipes: [ObjectId] (ref: Recipe),
  timestamps: true
}
```

### Recipe Model
```javascript
{
  ingredientsHash: String (indexed, for caching),
  title: String (required),
  ingredients: [String],
  instructions: [String],
  nutrition: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String
  },
  cuisine: String,
  createdBy: ObjectId (ref: User),
  recipeContent: String (for chat recipes),
  timestamps: true
}
```

### Chat Model
```javascript
{
  userId: ObjectId (ref: User),
  messages: [{
    role: String ("user" | "assistant"),
    content: String
  }],
  timestamps: true
}
```

---

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "message": "Error description",
  "status": "error" // Optional
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
- `429` - OpenAI Quota Exceeded

---

## 🧪 Testing

Currently, the project doesn't include automated tests. To test manually:

1. Use **Postman** or **Thunder Client** for REST API testing
2. Use **Socket.io Client** or browser console for WebSocket testing
3. Test authentication flow: Register → Login → Access Protected Routes
4. Test recipe generation with different ingredients and cuisines
5. Test real-time chat functionality

---

## 🔒 Security Features

- **Password Hashing:** Bcrypt with salt rounds
- **JWT Tokens:** HttpOnly cookies (XSS protection)
- **Input Validation:** Mongoose schema validation
- **CORS:** Configured for specific origins
- **Error Messages:** Generic messages to prevent information leakage

---

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 3000) |
| `MONGO_URL` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas cluster is accessible
- Check `MONGO_URL` in `.env` file
- Verify network connectivity

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is correct
- Check API quota/credits
- Ensure internet connectivity

### Socket.io Connection Issues
- Check CORS configuration in `socket.server.js`
- Verify client is connecting to correct URL
- Check if server is running and accessible

---

## 📄 License

ISC

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and questions, please open an issue on [GitHub](https://github.com/majidsaddiqye/Recipe-Remix-AI/issues).
