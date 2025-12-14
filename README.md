# 🍬 Sweetify - Sweet Shop Management System

A full-stack web application for managing a sweet shop's inventory, orders, and customer authentication. Built with modern technologies and following Test-Driven Development (TDD) principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Sweetify is a comprehensive sweet shop management system that enables shop owners to manage their inventory, track sales, and serve customers through an intuitive web interface. The application supports role-based access control with separate permissions for administrators and regular users.

## ✨ Features

### Backend Features
- 🔐 **JWT-based Authentication** - Secure user registration and login
- 👥 **Role-Based Access Control** - Admin and User roles with different permissions
- 🍭 **Inventory Management** - CRUD operations for sweet products
- 📦 **Stock Management** - Real-time inventory tracking and updates
- 🛒 **Purchase System** - Handle customer purchases with automatic stock deduction
- 📊 **RESTful API** - Well-structured API endpoints
- 📝 **API Documentation** - Interactive Swagger/OpenAPI documentation
- ✅ **Comprehensive Testing** - 29 passing tests with Jest and Supertest
- 🔒 **Security** - Helmet.js, CORS, bcrypt password hashing
- ⚡ **Input Validation** - Joi schema validation for all requests

### Frontend Features
- 🎨 **Modern UI** - Material-UI components with responsive design
- 🔐 **Authentication Flow** - Login, Register, and Protected Routes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🍬 **Product Catalog** - Browse and search sweet products
- 🛍️ **Shopping Cart** - Add items and manage cart
- 👤 **User Dashboard** - Personal account management
- 🔔 **Real-time Notifications** - Toast notifications for user actions
- 🌐 **Context API** - Global state management for authentication

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >=18.0.0 | Runtime environment |
| Express.js | 5.2.1 | Web framework |
| MongoDB | - | Database |
| Mongoose | 9.0.1 | ODM for MongoDB |
| JWT | 9.0.3 | Authentication tokens |
| Bcrypt | 6.0.0 | Password hashing |
| Joi | 18.0.2 | Request validation |
| Jest | 30.2.0 | Testing framework |
| Supertest | 7.1.4 | HTTP testing |
| Swagger | 6.2.8 | API documentation |
| Helmet | 7.1.0 | Security headers |
| CORS | 2.8.5 | Cross-origin resource sharing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| Vite | 5.4.21 | Build tool |
| Material-UI | 5.15.13 | UI component library |
| React Router | 6.23.0 | Client-side routing |
| Axios | 1.6.8 | HTTP client |
| Context API | - | State management |

## 📁 Project Structure

```
Sweetify/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── env.js         # Environment variables
│   │   ├── controllers/       # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   └── sweets.controller.js
│   │   ├── middlewares/       # Express middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── requireAdmin.js
│   │   │   ├── validateRequest.js
│   │   │   └── errorHandler.js
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   └── Sweet.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.routes.js
│   │   │   └── sweets.routes.js
│   │   ├── services/          # Business logic
│   │   │   ├── auth.service.js
│   │   │   └── sweets.service.js
│   │   ├── tests/             # Test suites
│   │   │   ├── auth.test.js
│   │   │   ├── sweets.test.js
│   │   │   ├── inventory.test.js
│   │   │   └── authMiddleware.test.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── jwt.js
│   │   │   ├── hashing.js
│   │   │   ├── errors.js
│   │   │   └── apiResponse.js
│   │   ├── validations/       # Joi schemas
│   │   │   ├── auth.validation.js
│   │   │   └── sweets.validation.js
│   │   ├── docs/              # API documentation
│   │   │   └── swagger.js
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── package.json
│   ├── jest.config.js
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/           # Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/          # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── render.yaml                 # Render deployment config
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (local instance or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jatin-Dev-Je/Sweetify.git
   cd Sweetify
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/sweetify

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=10

# CORS
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

### Production Environment

For production deployment, use stronger values:

```env
NODE_ENV=production
JWT_SECRET=<generate-with-crypto.randomBytes(64)>
BCRYPT_SALT_ROUNDS=12
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sweetify
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm run dev
```
Application runs on http://localhost:5173

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

**Test Coverage:**
- ✅ Authentication (Registration, Login, JWT validation)
- ✅ Authorization (Admin-only routes, User permissions)
- ✅ Sweets CRUD (Create, Read, Update, Delete)
- ✅ Inventory Management (Purchase, Restock)
- ✅ Edge Cases (Stock validation, Invalid inputs)
- ✅ Middleware (Auth, Admin, Validation)

**Test Results:** 29 passing tests

## 📚 API Documentation

### Access Swagger Documentation

Once the backend is running, visit:
```
http://localhost:5000/api/docs
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Sweets Management
- `GET /api/sweets` - Get all sweets (Public)
- `GET /api/sweets/search?q=chocolate` - Search sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin/Owner)
- `DELETE /api/sweets/:id` - Delete sweet (Admin/Owner)
- `POST /api/sweets/:id/purchase` - Purchase sweet (Authenticated)
- `POST /api/sweets/:id/restock` - Restock sweet (Admin/Owner)

### Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

## 🌐 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**
2. **Create MongoDB Atlas cluster** (free tier)
3. **Sign up at [render.com](https://render.com)**
4. **Create new Web Service:**
   - Repository: `Jatin-Dev-Je/Sweetify`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables:**
   - All variables from `.env` file
   - Use production values
6. **Deploy!**

### Frontend Deployment (Vercel)

1. **Sign up at [vercel.com](https://vercel.com)**
2. **Import project from GitHub**
3. **Configure:**
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variable:**
   - `VITE_BACKEND_URL=https://your-backend-url.onrender.com/api`
5. **Deploy!**

### Alternative Platforms

**Backend:**
- Railway
- Fly.io
- Heroku
- AWS EC2

**Frontend:**
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📸 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Jatin**
- GitHub: [@Jatin-Dev-Je](https://github.com/Jatin-Dev-Je)

## 🙏 Acknowledgments

- Material-UI for beautiful components
- MongoDB for database
- Express.js community
- React team

---

**Built with ❤️ using Node.js, React, and MongoDB**
