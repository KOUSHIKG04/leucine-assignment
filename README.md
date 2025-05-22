# User Access Management System

## Project Overview

This User Access Management System is a comprehensive role-based access control application designed to streamline the process of requesting, approving, and managing software access within an organization. The system implements a secure authentication mechanism and provides different interfaces based on user roles.

## Table of Contents

- [Features](#features)
- [Roles and Permissions](#roles-and-permissions)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Frontend Structure](#frontend-structure)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**
  - Secure signup and login functionality
  - JWT-based authentication
  - Password hashing with bcrypt
  - Session management

- **Role-Based Access Control**
  - Three distinct user roles with different permissions
  - Role-specific UI interfaces
  - Protected routes and API endpoints

- **Software Management**
  - Create and catalog software resources
  - Define access levels for each software
  - Manage software metadata

- **Access Request Workflow**
  - Submit access requests with justification
  - Review pending requests
  - Approve or reject requests with audit trail
  - View request history and status

- **User Management**
  - Admin dashboard for user oversight
  - Role assignment and modification
  - User account management

- **Responsive UI**
  - Modern, clean interface using Shadcn UI and Tailwind CSS
  - Mobile-friendly design
  - Intuitive user experience

## Roles and Permissions

### Employee
- Can sign up and login to the system
- Can browse available software
- Can request access to software with justification
- Can view their own request history and status

### Manager
- Includes all Employee permissions
- Can view all pending access requests
- Can approve or reject access requests
- Can provide feedback on rejected requests

### Admin
- Has full system access
- Can create and manage software resources
- Can view all access requests (pending, approved, rejected)
- Can manage users (view, edit roles, delete)
- Can override any access decision
- Can delete requests

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime for server-side code
- **Express.js**: Web framework for building the API
- **TypeScript**: Typed superset of JavaScript for better code quality
- **TypeORM**: Object-Relational Mapping library for database interactions
- **PostgreSQL**: Relational database for data storage
- **Neon DB**: Serverless PostgreSQL database service (optional)
- **JWT (JSON Web Tokens)**: For secure authentication
- **bcrypt**: For password hashing
- **cors**: For handling Cross-Origin Resource Sharing

### Frontend
- **React**: JavaScript library for building user interfaces
- **TypeScript**: For type-safe code
- **React Router**: For client-side routing
- **Axios**: For HTTP requests
- **Shadcn UI**: Component library for consistent design
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Context API**: For state management

## Architecture

### Backend Architecture

The backend follows a layered architecture pattern:

1. **Routes Layer**: Defines API endpoints and routes requests to appropriate controllers
2. **Middleware Layer**: Handles authentication, authorization, and request validation
3. **Controller Layer**: Contains business logic and processes requests
4. **Data Access Layer**: Interfaces with the database using TypeORM repositories
5. **Entity Layer**: Defines database models and relationships

### Frontend Architecture

The frontend follows a component-based architecture:

1. **Pages**: Top-level components representing different routes
2. **Components**: Reusable UI elements
3. **Context**: Global state management using React Context API
4. **Services**: API communication and data fetching
5. **Types**: TypeScript type definitions

### Database Schema

- **User**: Stores user information and roles
- **Software**: Stores software resources and access levels
- **Request**: Stores access requests with relationships to users and software

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

   **Option 1: Using individual database connection parameters:**
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=access_management
   ```
   
   **Option 2: Using Neon database URL:**
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=postgres://user:password@endpoint:port/database
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

## Frontend Structure

### Directory Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   ├── Navbar.tsx        # Navigation component
│   │   ├── ProtectedRoute.tsx # Auth protection wrapper
│   │   └── Requestcard.tsx   # Request display component
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── pages/
│   │   ├── AllRequestsPage.tsx   # Admin view of all requests
│   │   ├── CreateSoftwarePage.tsx # Admin software creation
│   │   ├── Dashboard.tsx      # User dashboard
│   │   ├── HomePage.tsx       # Landing page
│   │   ├── LoginPage.tsx      # User login
│   │   ├── ManageUsersPage.tsx # Admin user management
│   │   ├── PendingRequestsPage.tsx # Manager request approval
│   │   ├── RequestAccessPage.tsx # Employee access requests
│   │   └── SignupPage.tsx     # User registration
│   ├── services/
│   │   └── api.ts            # API service configuration
│   ├── types/
│   │   └── types.ts          # TypeScript type definitions
│   ├── App.css               # Global styles
│   ├── App.tsx               # Main application component
│   ├── index.css             # Entry CSS file
│   └── main.tsx              # Application entry point
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts           # Vite bundler configuration
```

### Key Components

#### Authentication
- **AuthContext**: Manages user authentication state and provides login/logout functions
- **ProtectedRoute**: Higher-order component that restricts access based on user roles

#### UI Components
- **Navbar**: Navigation bar with role-specific links
- **RequestCard**: Displays request information with appropriate actions
- **UI Components**: Reusable components like Button, Card, Dialog, etc.

#### Pages
- **Role-Specific Pages**: Different interfaces for each user role
- **Form Pages**: Input validation and submission handling
- **List Pages**: Data fetching and display

## Security

### Authentication
- **JWT-based Authentication**: Secure token-based authentication system
- **HTTP-only Cookies**: For secure token storage (optional configuration)
- **Token Expiration**: Automatic session expiry after 24 hours

### Authorization
- **Role-Based Access Control**: Different permissions for different user roles
- **Middleware Protection**: Server-side route protection
- **Frontend Route Guards**: Client-side route protection

### Data Protection
- **Password Hashing**: Using bcrypt with salt rounds
- **Input Validation**: Server-side validation of all inputs
- **CORS Protection**: Configured to allow only specific origins
- **Error Handling**: Secure error responses without exposing sensitive information

## Troubleshooting

### Common Issues

#### Backend Connection Issues

**Problem**: Frontend cannot connect to backend (`ERR_CONNECTION_REFUSED`)

**Solutions**:
- Ensure the backend server is running on the correct port (default: 5000)
- Check that the API URL in the frontend configuration matches the backend URL
- Verify there are no firewall or network issues blocking the connection

#### Database Connection Issues

**Problem**: Backend fails to connect to the database

**Solutions**:
- For local PostgreSQL:
  - Ensure PostgreSQL service is running
  - Verify database credentials in `.env` file
  - Check that the database exists

- For Neon DB:
  - Verify the connection string format
  - Ensure the database exists in your Neon account
  - Check IP allowlist settings if applicable

#### Authentication Issues

**Problem**: Users cannot log in or access protected routes

**Solutions**:
- Check that JWT_SECRET is properly set in the backend `.env` file
- Verify that tokens are being properly stored and sent with requests
- Check browser console for any CORS-related errors

#### Entity Relationship Issues

**Problem**: Database migration errors when adding new fields

**Solutions**:
- Make new entity fields nullable when adding to existing tables
- Use TypeORM migrations for complex schema changes
- Consider dropping and recreating the database during development (not for production)
