# 🎨 Recipe Remix AI - Frontend

Modern, responsive React frontend for Recipe Remix AI. Built with **Vite**, **React 19**, **Tailwind CSS**, and **Framer Motion** for a smooth, beautiful user experience.

---

## 🚀 Features

* **🎯 Modern UI/UX:** Beautiful, responsive design with smooth animations
* **💬 Real-time Chat:** Socket.io integration for instant AI responses
* **📱 Responsive Design:** Works seamlessly on desktop, tablet, and mobile
* **🔐 Protected Routes:** Secure authentication with route guards
* **💾 Persistent State:** LocalStorage for user session management
* **📝 Markdown Support:** Rich recipe formatting with ReactMarkdown
* **🎨 Component Library:** Custom UI components built with Radix UI
* **⚡ Fast Development:** Vite for lightning-fast HMR

---

## 🏗 Tech Stack

| Technology | Usage |
| :--- | :--- |
| **React 19** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **React Router** | Client-side Routing |
| **Tailwind CSS** | Utility-first CSS Framework |
| **Framer Motion** | Animation Library |
| **Socket.io Client** | Real-time Communication |
| **Axios** | HTTP Client |
| **React Hook Form** | Form Management |
| **Zod** | Schema Validation |
| **React Markdown** | Markdown Rendering |
| **Sonner** | Toast Notifications |
| **Lucide React** | Icon Library |
| **Radix UI** | Accessible Component Primitives |

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Backend server running (see [Server README](../Server/README.md))

---

## 🔧 Installation & Setup

### 1. Navigate to Client Directory

```bash
cd Client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `Client` directory (optional, defaults are set):

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

---

## 📁 Project Structure

```
Client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI component library
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── card.jsx
│   │   │   └── scroll-area.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Auth.jsx        # Login/Signup
│   │   ├── Dashboard.jsx   # Main chat interface
│   │   └── SavedRecipes.jsx # Saved recipes page
│   ├── lib/                 # Utilities & configurations
│   │   ├── axios.js        # API client setup
│   │   ├── socket.js       # Socket.io client
│   │   └── utils.js        # Helper functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

---

## 🎯 Key Components

### Home Page (`Home.jsx`)
- Landing page with hero section
- Feature showcase
- Call-to-action buttons
- Responsive design with animations

### Authentication (`Auth.jsx`)
- Unified login/signup form
- Form validation with Zod
- React Hook Form integration
- Smooth transitions between modes

### Dashboard (`Dashboard.jsx`)
- Real-time chat interface
- Fixed sidebar with navigation
- Dietary preferences management
- Message history with auto-scroll
- Markdown recipe rendering
- Save recipe functionality

### Saved Recipes (`SavedRecipes.jsx`)
- Display all saved recipes
- Markdown content rendering
- Delete recipe functionality
- Empty state handling

---

## 🔌 API Integration

### Axios Configuration

```javascript
// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // For HttpOnly cookies
});
```

### Socket.io Configuration

```javascript
// src/lib/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
});
```

---

## 🛣️ Routing

Routes are defined in `App.jsx`:

```javascript
/                    → Home page
/login              → Authentication (login mode)
/signup             → Authentication (signup mode)
/dashboard          → Main chat interface (protected)
/saved              → Saved recipes (protected)
```

**Protected Routes:** Require authentication. Unauthenticated users are redirected to `/login`.

---

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color scheme (orange/slate)
- Responsive breakpoints
- Dark mode ready (sidebar)

### Component Styling
- Custom UI components in `components/ui/`
- Consistent design system
- Accessible components with Radix UI

---

## 🔐 Authentication Flow

1. User registers/logs in via `Auth.jsx`
2. Backend returns user data with JWT cookie
3. User data stored in `localStorage`
4. `ProtectedRoute` checks for user data
5. Authenticated users can access protected routes
6. Logout clears `localStorage` and redirects

---

## 💬 Real-time Chat Implementation

### Connection
```javascript
socket.connect();
socket.on("connect", () => {
  socket.emit("load_history", { userId: user._id });
});
```

### Sending Messages
```javascript
socket.emit("send_msg", { 
  userId: user._id, 
  text: message 
});
```

### Receiving Messages
```javascript
socket.on("receive_msg", (msg) => {
  setMessages((prev) => [...prev, msg]);
});
```

---

## 🥗 Dietary Preferences

Users can manage dietary preferences in the Dashboard sidebar:

- **Available Options:** Vegan, Vegetarian, Gluten-Free, Keto, Paleo, Dairy-Free, Nut-Free, Low-Carb, Halal, Kosher
- **UI:** Collapsible section with checkboxes
- **Persistence:** Saved to backend via `PUT /api/auth/dietary-preferences`
- **AI Integration:** Preferences automatically considered in AI responses

---

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel:** Connect GitHub repo, auto-deploy
- **Netlify:** Drag & drop `dist/` folder
- **GitHub Pages:** Use `gh-pages` package
- **Any Static Host:** Upload `dist/` folder

---

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Structure Guidelines

- **Components:** Keep components small and focused
- **State Management:** Use React hooks (useState, useEffect)
- **API Calls:** Use Axios instance from `lib/axios.js`
- **Styling:** Prefer Tailwind utility classes
- **Icons:** Use Lucide React icons
- **Forms:** Use React Hook Form with Zod validation

---

## 🐛 Troubleshooting

### Socket Connection Issues
- Verify backend server is running
- Check `VITE_SOCKET_URL` in `.env`
- Ensure CORS is configured on backend

### API Request Failures
- Check `VITE_API_URL` in `.env`
- Verify backend is accessible
- Check browser console for CORS errors

### Build Issues
- Clear `node_modules` and reinstall
- Check Node.js version (v18+)
- Verify all dependencies are installed

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:3000` |

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    }
  }
}
```

### Components
All UI components are in `src/components/ui/` and can be customized.

---

## 📄 License

ISC

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and questions, please open an issue on [GitHub](https://github.com/majidsaddiqye/Recipe-Remix-AI/issues).
