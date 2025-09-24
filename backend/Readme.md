# Budget Buddy Backend

A Node.js + Express backend for the Budget Buddy app, providing secure user authentication and robust transaction management APIs.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Transaction Routes](#transaction-routes)
- [Authentication Guide](#authentication-guide)
- [Error Handling](#error-handling)
- [Contact](#contact)
- [License](#license)

---

## Overview

This backend powers the Budget Buddy application, enabling users to register, log in, and manage their financial transactions. It uses JWT-based authentication and MongoDB for data storage. All endpoints return consistent JSON responses, making integration with any frontend (React, Vue, etc.) straightforward.

---

## Tech Stack

- **Node.js** (runtime)
- **Express.js** (web framework)
- **MongoDB** (database, via Mongoose)
- **JWT** (authentication)
- **CORS**, **cookie-parser** (middleware)

---

## Project Structure

```
backend/
│
├── app.js
├── index.js
├── config/
│   └── Db.js
├── controllers/
│   ├── Transactions.controllers.js
│   └── User.controllers.js
├── models/
│   ├── Transaction.models.js
│   └── User.models.js
├── routes/
│   ├── Transaction.routes.js
│   └── User.routes.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── AsyncHandler.js
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB and environment variables**  
   (See `.env.example` for required variables. **Do not** commit your `.env` file.)

3. **Run the server:**
   ```bash
   npm run dev
   ```
   The server will start on the port specified in your `.env` file (e.g., `http://localhost:5000`).

---

## API Endpoints

All endpoints return a JSON response with the following structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Some message"
}
```
If an error occurs, you'll receive:
```json
{
  "success": false,
  "message": "Error message"
}
```

---

### User Routes

#### Register

- **POST** `/api/v1/users/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "userId",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "message": "User registered successfully"
  }
  ```

#### Login

- **POST** `/api/v1/users/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "_id": "userId",
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    "message": "Login successful"
  }
  ```
- **How to use:**  
  Save the `token` in cookies or localStorage. For all transaction routes, send this token as a Bearer token in the `Authorization` header or as a cookie.

---

### Transaction Routes

> **All transaction routes require authentication.**  
> Send the JWT token as a Bearer token in the `Authorization` header:  
> `Authorization: Bearer <JWT_TOKEN>`

#### Create Transaction

- **POST** `/api/v1/transaction/`
- **Request Body:**
  ```json
  {
    "amount": 500,
    "transactionType": "income", // or "expense"
    "category": "Salary",
    "description": "August salary",
    "transactionDate": "2024-08-01T00:00:00.000Z"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "transactionId",
      "userId": "userId",
      "amount": 500,
      "transactionType": "income",
      "category": "Salary",
      "description": "August salary",
      "transactionDate": "2024-08-01T00:00:00.000Z"
    },
    "message": "Transaction created successfully"
  }
  ```

#### Get All Transactions

- **GET** `/api/v1/transaction/`
- **Query Params (optional):**
  - `category=Salary`
  - `startDate=2024-08-01`
  - `endDate=2024-08-31`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "allTransactions": [
        {
          "_id": "transactionId",
          "amount": 500,
          "transactionType": "income",
          "category": "Salary",
          "description": "August salary",
          "transactionDate": "2024-08-01T00:00:00.000Z"
        }
        // ...more transactions
      ],
      "count": 1
    },
    "message": "Transactions fetched succesfully"
  }
  ```

#### Get Transaction By ID

- **GET** `/api/v1/transaction/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "transaction": {
        "_id": "transactionId",
        "amount": 500,
        "transactionType": "income",
        "category": "Salary",
        "description": "August salary",
        "transactionDate": "2024-08-01T00:00:00.000Z"
      }
    },
    "message": "Transaction fetched successfully"
  }
  ```

#### Update Transaction

- **PUT** `/api/v1/transaction/:id`
- **Request Body:**
  ```json
  {
    "amount": 600,
    "transactionType": "income",
    "category": "Salary",
    "description": "Updated salary",
    "transactionDate": "2024-08-01T00:00:00.000Z"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "transactionId",
      "amount": 600,
      "transactionType": "income",
      "category": "Salary",
      "description": "Updated salary",
      "transactionDate": "2024-08-01T00:00:00.000Z"
    },
    "message": "Transaction updated successfully"
  }
  ```

#### Delete Transaction

- **DELETE** `/api/v1/transaction/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "transactionId",
      "amount": 600,
      "transactionType": "income",
      "category": "Salary",
      "description": "Updated salary",
      "transactionDate": "2024-08-01T00:00:00.000Z"
    },
    "message": "Transaction deleted successfully"
  }
  ```

#### Get Transaction Summary

- **GET** `/api/v1/transaction/summary`
- **Query Params (optional):**
  - `startDate=2024-08-01`
  - `endDate=2024-08-31`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalIncome": 1000,
      "totalExpense": 400,
      "balance": 600,
      "categoryWise": {
        "Salary": 1000,
        "Food": 200,
        "Shopping": 200
      }
    },
    "message": "Transaction summary fetched successfully"
  }
  ```

---

## Authentication Guide

- **Register** and **login** endpoints are public.
- All `/api/v1/transaction/*` endpoints require authentication.
- After login, store the JWT token in your frontend (preferably in an HTTP-only cookie for security, or in localStorage for development).
- For each protected request, send the token as:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- If using cookies, ensure your frontend sends credentials:
  ```js
  axios.get('/api/v1/transaction/', { withCredentials: true });
  ```

---

## Error Handling

All errors return a consistent JSON structure:
```json
{
  "success": false,
  "message": "Error message"
}
```
- Common error codes: `400` (Bad Request), `401` (Unauthorized), `404` (Not Found), `500` (Server Error)
- Check the `message` field for details.

---

## Contact

For questions or issues, please open an issue or contact the maintainer.

---

##