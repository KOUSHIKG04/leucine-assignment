# User Access Management System

A comprehensive role-based access control system for managing software access requests.

## Features

- **Authentication**: User signup and login
- **Role-Based Access Control**: Three distinct roles with different permissions
- **Software Management**: Create and manage software resources
- **Access Requests**: Request, approve, and reject access to software
- **User Management**: Admin tools to manage users and their roles

## Roles

- **Employee**: Can sign up, login, and request software access
- **Manager**: Can view and approve/reject access requests
- **Admin**: Has full access to the system, including creating software, managing users, and handling all requests

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=access_management
   ```

4. Create the PostgreSQL database:
   ```
   createdb access_management
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## API Documentation

### Authentication

#### Sign Up
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "Employee" | "Manager" | "Admin" (optional, defaults to "Employee")
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "message": "User created successfully"
  }
  ```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "number",
      "username": "string",
      "role": "string"
    }
  }
  ```

### Software Management

#### Create Software
- **URL**: `/api/software`
- **Method**: `POST`
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "accessLevels": ["Read", "Write", "Admin"]
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "message": "Software created successfully",
    "software": {
      "id": "number",
      "name": "string",
      "description": "string",
      "accessLevels": ["string"]
    }
  }
  ```

#### Get All Software
- **URL**: `/api/software`
- **Method**: `GET`
- **Auth**: Required
- **Response**: 200 OK
  ```json
  [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "accessLevels": ["string"]
    }
  ]
  ```

### Access Requests

#### Create Request
- **URL**: `/api/requests`
- **Method**: `POST`
- **Auth**: Required (Employee only)
- **Body**:
  ```json
  {
    "softwareId": "number",
    "accessType": "Read" | "Write" | "Admin",
    "reason": "string"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "message": "Access request submitted successfully",
    "request": {
      "id": "number",
      "user": { "id": "number", "username": "string" },
      "software": { "id": "number", "name": "string" },
      "accessType": "string",
      "reason": "string",
      "status": "Pending"
    }
  }
  ```

#### Get Pending Requests
- **URL**: `/api/requests/pending`
- **Method**: `GET`
- **Auth**: Required (Manager only)
- **Response**: 200 OK
  ```json
  [
    {
      "id": "number",
      "user": { "id": "number", "username": "string" },
      "software": { "id": "number", "name": "string" },
      "accessType": "string",
      "reason": "string",
      "status": "Pending"
    }
  ]
  ```

#### Update Request Status
- **URL**: `/api/requests/:id`
- **Method**: `PATCH`
- **Auth**: Required (Manager or Admin)
- **Body**:
  ```json
  {
    "status": "Approved" | "Rejected"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "message": "Request approved/rejected successfully",
    "request": {
      "id": "number",
      "user": { "id": "number", "username": "string" },
      "software": { "id": "number", "name": "string" },
      "accessType": "string",
      "reason": "string",
      "status": "Approved" | "Rejected"
    }
  }
  ```

#### Get All Requests (Admin)
- **URL**: `/api/requests`
- **Method**: `GET`
- **Auth**: Required (Admin only)
- **Response**: 200 OK
  ```json
  [
    {
      "id": "number",
      "user": { "id": "number", "username": "string" },
      "software": { "id": "number", "name": "string" },
      "accessType": "string",
      "reason": "string",
      "status": "Pending" | "Approved" | "Rejected"
    }
  ]
  ```

#### Delete Request (Admin)
- **URL**: `/api/requests/:id`
- **Method**: `DELETE`
- **Auth**: Required (Admin only)
- **Response**: 200 OK
  ```json
  {
    "message": "Request deleted successfully"
  }
  ```

### User Management (Admin)

#### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Auth**: Required (Admin only)
- **Response**: 200 OK
  ```json
  [
    {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "string",
      "createdAt": "date"
    }
  ]
  ```

#### Update User Role
- **URL**: `/api/users/:id`
- **Method**: `PATCH`
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "role": "Employee" | "Manager" | "Admin"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "message": "User role updated to [role] successfully",
    "user": {
      "id": "number",
      "username": "string",
      "role": "string"
    }
  }
  ```

#### Delete User
- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Auth**: Required (Admin only)
- **Response**: 200 OK
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Security

- JWT authentication for all protected routes
- Role-based middleware to ensure proper access control
- Password hashing with bcrypt
- Input validation for all API endpoints

## Technologies Used

### Backend
- Node.js
- Express.js
- TypeORM
- PostgreSQL
- TypeScript
- JWT for authentication

### Frontend
- React
- TypeScript
- React Router
- Axios
- Shadcn UI components
- Tailwind CSS
