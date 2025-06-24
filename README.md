# CollegeFlow - Backend API

**🌐 Live Frontend Application**: [https://college-flow.vercel.app/](https://college-flow.vercel.app/)

## 🎓 Overview

CollegeFlow Backend is a RESTful API built with Node.js and Express that serves as the server-side application for the college application platform. It provides endpoints for college information, user authentication, admission management, reviews, and user profile operations.

## 🚀 Features

### Core API Features

- **College Management**: CRUD operations for college data
- **Search Functionality**: Search colleges by name with regex matching
- **User Authentication**: JWT-based authentication system
- **Admission System**: Application submission and management
- **Review System**: User reviews and ratings for colleges
- **User Profile**: Profile management and updates
- **Gallery & Research**: College gallery images and research papers

### Security Features

- JWT token-based authentication
- CORS configuration for cross-origin requests
- Authorization middleware for protected routes
- Environment variable configuration

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with MongoDB Driver 6.17.0
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **Security**: CORS 2.8.5
- **Environment**: dotenv 16.5.0
- **Middleware**: cookie-parser 1.4.7

## 📦 Installation

### Prerequisites

- Node.js (version 16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abubokkor98/collegeFlow-server
   cd collegeflow-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   SECRET_KEY=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start the server**

   ```bash
   # Development
   node index.js

   # The server will run on http://localhost:5000
   ```

## 🔗 API Endpoints

### Authentication Routes

| Method | Endpoint  | Description                  | Auth Required |
| ------ | --------- | ---------------------------- | ------------- |
| POST   | `/jwt`    | Generate JWT token           | No            |
| GET    | `/logout` | Clear authentication cookies | No            |

### College Routes

| Method | Endpoint                      | Description                    | Auth Required |
| ------ | ----------------------------- | ------------------------------ | ------------- |
| GET    | `/colleges`                   | Get all colleges               | No            |
| GET    | `/search-college?search=name` | Search colleges by name        | No            |
| GET    | `/college/:id`                | Get single college details     | Yes           |
| GET    | `/gallery-images`             | Get all college gallery images | No            |
| GET    | `/research-papers`            | Get all research papers        | No            |

### Admission Routes

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| POST   | `/add-admission` | Submit college admission | Yes           |
| GET    | `/my-admissions` | Get user's admissions    | Yes           |

### Review Routes

| Method | Endpoint      | Description        | Auth Required |
| ------ | ------------- | ------------------ | ------------- |
| POST   | `/add-review` | Add college review | Yes           |
| GET    | `/reviews`    | Get all reviews    | No            |

### User Profile Routes

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| POST   | `/users`       | Create new user     | No            |
| GET    | `/user/:email` | Get user profile    | Yes           |
| PUT    | `/user/:email` | Update user profile | Yes           |

## 🔐 Authentication

### JWT Implementation

The API uses JWT (JSON Web Tokens) for authentication with the following flow:

1. **Token Generation**: POST to `/jwt` with user credentials
2. **Token Usage**: Include token in Authorization header: `Bearer <token>`
3. **Token Verification**: Middleware validates token for protected routes
4. **Token Expiration**: Tokens expire after 1 hour

## 🔧 Environment Variables

| Variable     | Description        | Example                       |
| ------------ | ------------------ | ----------------------------- |
| `PORT`       | Server port number | `5000`                        |
| `DB_USER`    | MongoDB username   | `your_username`               |
| `DB_PASS`    | MongoDB password   | `your_password`               |
| `SECRET_KEY` | JWT secret key     | `your_secret_key`             |
| `NODE_ENV`   | Environment mode   | `development` or `production` |

## ⚠️ Known Issues & TODOs

1. **JWT Testing**: JWT validation middleware needs thorough testing
2. **Cookie Implementation**: Cookie-based authentication is commented out
3. **Error Handling**: Could benefit from more comprehensive error handling
4. **Input Validation**: No request body validation implemented
5. **Rate Limiting**: No rate limiting implemented for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

---

**Version**: 1.0.0  
**Last Updated**: June 2025  
**Maintained by**: CollegeFlow Development Team
