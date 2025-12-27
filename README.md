# 🍳 Recipe Remix AI

<div align="center">

**AI-Powered Culinary Assistant - Create Perfect Recipes with AI Intelligence**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**Recipe Remix AI** is a full-stack web application that leverages AI to help users create personalized recipes. Chat naturally with an AI chef, get instant recipe suggestions based on available ingredients, save your favorites, and manage dietary preferences—all in one beautiful, modern interface.

### Key Highlights

- 🤖 **AI-Powered:** Powered by OpenAI GPT-4o-mini for intelligent recipe generation
- 💬 **Real-time Chat:** Natural language conversation with persistent chat history
- 🥗 **Dietary Support:** Set preferences (Vegan, Keto, Gluten-Free, etc.) and AI adapts
- 📱 **Responsive Design:** Beautiful UI that works on all devices
- 🔐 **Secure:** JWT authentication with HttpOnly cookies
- ⚡ **Fast:** Optimized with caching and efficient API calls

---

## ✨ Features

### 🎯 Core Features

- **Real-time AI Chat Interface**
  - Natural language conversation with AI chef
  - Persistent chat history (resume where you left off)
  - Markdown recipe formatting
  - Multi-language support

- **Smart Recipe Generation**
  - Generate recipes from available ingredients
  - Support for multiple cuisines
  - Nutritional information included
  - Caching system to reduce API costs

- **Recipe Management**
  - Save favorite recipes to personal collection
  - View saved recipes anytime
  - Delete recipes from collection
  - Markdown content preservation

- **Dietary Preferences**
  - Set multiple dietary preferences (Vegan, Vegetarian, Keto, etc.)
  - AI automatically considers preferences in responses
  - Easy-to-use sidebar interface

- **User Authentication**
  - Secure registration and login
  - JWT-based session management
  - Protected routes
  - Password hashing with Bcrypt

### 🎨 UI/UX Features

- Modern, clean design
- Smooth animations with Framer Motion
- Responsive layout (mobile, tablet, desktop)
- Dark sidebar theme
- Toast notifications
- Loading states
- Empty states

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation
- **React Markdown** - Markdown rendering

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB + Mongoose** - Database
- **Socket.io** - WebSocket server
- **OpenAI API** - AI integration
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key ([Get one here](https://platform.openai.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/majidsaddiqye/Recipe-Remix-AI.git
   cd Recipe-Remix-AI
   ```

2. **Backend Setup**
   ```bash
   cd Server
   npm install
   
   # Create .env file
   cp .env.example .env  # Or create manually
   # Add your MongoDB URL, JWT_SECRET, and OPENAI_API_KEY
   
   npm start
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd Client
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

---

## 📁 Project Structure

```
Recipe-Remix-AI/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & configs
│   │   └── App.jsx        # Main app
│   ├── package.json
│   └── README.md          # Frontend documentation
│
├── Server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # External services
│   │   ├── middlewares/   # Auth & validation
│   │   └── sockets/       # Socket.io handlers
│   ├── server.js          # Entry point
│   ├── package.json
│   └── README.md          # Backend documentation
│
└── README.md              # This file
```

---

## 📚 Documentation

- **[Backend Documentation](./Server/README.md)** - API endpoints, setup guide, architecture
- **[Frontend Documentation](./Client/README.md)** - Component guide, routing, styling

---

## 🎯 Usage

### Getting Started

1. **Sign Up / Login**
   - Create an account or login with existing credentials
   - Your session is automatically saved

2. **Set Dietary Preferences** (Optional)
   - Click "Dietary Preferences" in the sidebar
   - Select your preferences (Vegan, Keto, etc.)
   - Click "Save Preferences"

3. **Chat with AI Chef**
   - Type your recipe request in natural language
   - Example: "Mujhe chicken biryani ki recipe chahiye"
   - AI will respond with a detailed recipe

4. **Save Recipes**
   - Hover over any AI recipe response
   - Click "Save Recipe" button
   - Access saved recipes from sidebar

5. **View Saved Recipes**
   - Click "Saved Recipes" in sidebar
   - View all your saved recipes
   - Delete recipes you no longer need

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/dietary-preferences` - Update dietary preferences

### Recipes
- `POST /api/recipes/generate` - Generate recipe from ingredients
- `POST /api/recipes/save` - Save recipe
- `GET /api/recipes/my-recipes` - Get saved recipes
- `DELETE /api/recipes/remove/:id` - Remove saved recipe

### Real-time Chat (Socket.io)
- `load_history` - Load chat history
- `send_msg` - Send message to AI
- `receive_msg` - Receive AI response

For detailed API documentation, see [Server README](./Server/README.md).

---

## 🔐 Environment Variables

### Backend (.env in Server/)
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/recipe-remix-ai
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-api-key
```

### Frontend (.env in Client/) - Optional
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## 🧪 Testing

Currently, manual testing is recommended:

1. **API Testing:** Use Postman or Thunder Client
2. **Socket Testing:** Use browser console or Socket.io client
3. **E2E Testing:** Test complete user flows in browser

---

## 🚀 Deployment

### Backend Deployment
- **Recommended:** Railway, Render, or Heroku
- Set environment variables
- Ensure MongoDB is accessible
- Update CORS settings for production domain

### Frontend Deployment
- **Recommended:** Vercel, Netlify, or GitHub Pages
- Build command: `npm run build`
- Output directory: `dist/`
- Update API URLs in environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Authors

- **Majid Saddiqye** - [GitHub](https://github.com/majidsaddiqye)

---

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- React team for the amazing framework
- All open-source contributors whose libraries made this possible

---

## 📧 Support

For support, email support@example.com or open an issue on [GitHub](https://github.com/majidsaddiqye/Recipe-Remix-AI/issues).

---

## 🗺️ Roadmap

- [ ] Recipe search functionality
- [ ] Recipe sharing between users
- [ ] Recipe rating and reviews
- [ ] Meal planning features
- [ ] Shopping list generation
- [ ] Mobile app (React Native)
- [ ] Multi-language UI support
- [ ] Recipe image generation

---

<div align="center">

**Made with ❤️ using React, Node.js, and OpenAI**

⭐ Star this repo if you find it helpful!

</div>

