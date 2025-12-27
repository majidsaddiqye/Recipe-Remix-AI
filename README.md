# 🍳 Recipe Remix AI - Backend API

Professional AI-powered culinary assistant backend. Built with the **MERN Stack**, integrating **OpenAI GPT-4o-mini** for intelligent recipe generation and **Socket.io** for real-time persistent chat.

---

## 🚀 Core Functionalities

* **🔐 Secure Authentication:** Full JWT implementation with `HttpOnly` cookie-based sessions and password hashing using `Bcrypt`.
* **🤖 AI Recipe Engine:** Optimized OpenAI integration using **Structured JSON Mode** to provide parseable recipe data (title, ingredients, instructions, nutrition).
* **⚡ Smart Caching Layer:** MongoDB-based caching system that stores generated recipes to reduce API latency and minimize OpenAI token costs.
* **💬 Persistent Real-time Chat:** Seamless chat experience using **Socket.io**. Every conversation is stored in MongoDB, allowing users to resume chats after logout.
* **📂 Recipe Management:** Users can bookmark AI-generated recipes, viewing their personalized collection at any time.
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

---

## 🔌 API Documentation

### 1. Authentication (`/api/auth`)
* `POST /register` : Naya user create karne ke liye.
* `POST /login` : Token generate karne aur cookie set karne ke liye.
* `POST /logout` : Auth cookie clear karne ke liye.

### 2. Recipe Engine (`/api/recipes`)
* `POST /generate` : Ingredients aur cuisine ke mutabiq AI recipe hasil karein.
* `POST /save` : Kisi bhi recipe ID ko user library mein save karein.
* `GET /my-recipes` : User ki saved recipes fetch karein.

### 3. Real-time Chat (Socket Events)
* **Event:** `load_history`
    * *Payload:* `{ userId }`
    * *Response:* `chat_history` (Array of messages)
* **Event:** `send_msg`
    * *Payload:* `{ userId, text }`
    * *Response:* `receive_msg` (Real-time AI Response)

---

## 🛠 Project Structure

```text
src/
├── controllers/    # Business logic handlers
├── models/         # Database schemas (User, Chat, Recipe)
├── routes/         # Express API endpoints
├── services/       # OpenAI integration logic
├── middlewares/    # Auth & validation layers
└── sockets/        # Real-time event management