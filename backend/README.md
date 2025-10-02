# JustNotes - Backend API

A secure and scalable backend for the JustNotes note-taking app built with Node.js, Express, and PostgreSQL.

## Features

- JWT-based User Authentication with email verification
- Full CRUD operations for notes with categories and tags
- Secure password reset flow with email verification
- API rate limiting using Redis/Upstash
- Nodemailer integration for email notifications
- Input validation, CORS, and secure password hashing

## Tech Stack

- Node.js with Express.js
- PostgreSQL with Prisma ORM
- JWT for authentication
- Redis/Upstash for caching and rate limiting
- Nodemailer for email service

## Project Structure

```
src/
├── config/ # Database and external service configs
├── controllers/ # Route controllers
├── middlewares/ # Middleware functions
├── routes/ # API route definitions
├── services/ # Business logic and data access
├── utils/ # Helper functions
├── app.js # Express application setup
└── server.js # Server entry point

```

### Data Models

-   Users: accounts with email verification
-   Notes: notes with categories and tags
-   Categories: user-defined note categories
-   Refresh Tokens: secure token management

### Security Features

-   Password hashing with bcrypt
-   JWT token-based authentication
-   Request input validation
-   API rate limiting
-   Configurable CORS

## API Endpoints

**Authentication**

-   POST `/api/auth/register`
-   POST `/api/auth/login`
-   POST `/api/auth/refresh`
-   POST `/api/auth/logout`
-   POST `/api/auth/email/verify`
-   POST `/api/auth/email/resend`
-   POST `/api/auth/password/forgot`
-   POST `/api/auth/password/reset`

**Notes**

-   GET `/api/notes`
-   GET `/api/notes/:id`
-   POST `/api/notes`
-   PUT `/api/notes/:id`
-   DELETE `/api/notes/:id`

**Categories**

-   GET `/api/categories`
-   GET `/api/categories/:id`
-   POST `/api/categories`
-   PUT `/api/categories/:id`
-   DELETE `/api/categories/:id`
-   GET `/api/categories/:id/notes`

## Security Implementation

-   User registration → email verification → JWT tokens
-   Access tokens expire in 15 minutes, refresh tokens in 7 days
-   API endpoints and email services rate-limited
-   Input validation to prevent SQL injection and XSS
