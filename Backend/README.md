# Uber Clone Project Backend

## File Descriptions

### Routes

#### user.routes.js
Handles user-related routes such as registration, login, profile retrieval, and logout.

#### captain.routes.js
Handles captain-related routes such as registration, login, profile retrieval, and logout.

### Models

#### user.model.js
Defines the schema for the User model, including methods for generating JWT tokens, comparing passwords, and hashing passwords.

#### captain.model.js
Defines the schema for the Captain model, including methods for generating JWT tokens, comparing passwords, and hashing passwords.

#### blacklist.token.model.js
Defines the schema for storing blacklisted tokens to prevent reuse after logout.

### Middlewares

#### auth.middleware.js
Contains middleware functions for authenticating users and captains by verifying JWT tokens and checking if they are blacklisted.

### Controllers

#### user.controller.js
Handles user-related operations such as registration, login, profile retrieval, and logout.

#### captain.controller.js
Handles captain-related operations such as registration, login, profile retrieval, and logout.

### Database

#### connect.database.js
Handles the connection to the MongoDB database using Mongoose.

### Server

#### server.js
Sets up the HTTP server and listens on the specified port.

### Application

#### app.js
Initializes the Express application, connects to the database, sets up middlewares, and defines the routes.

## Routes

### User Routes

#### POST /users/register
Registers a new user.
- **Request Example:**
  ```json
  {
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response Example:**
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```
- **Status Codes:**
  - 201: Created
  - 400: Bad Request

#### POST /users/login
Logs in an existing user.
- **Request Example:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response Example:**
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```
- **Status Codes:**
  - 200: OK
  - 400: Bad Request
  - 401: Unauthorized

#### GET /users/profile
Retrieves the profile of the authenticated user.
- **Response Example:**
  ```json
  {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
  ```
- **Status Codes:**
  - 200: OK
  - 401: Unauthorized

#### GET /users/logout
Logs out the authenticated user.
- **Response Example:**
  ```json
  {
    "message": "Logged out"
  }
  ```
- **Status Codes:**
  - 200: OK
  - 401: Unauthorized

### Captain Routes

#### POST /captains/register
Registers a new captain.
- **Request Example:**
  ```json
  {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "password": "password123",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```
- **Response Example:**
  ```json
  {
    "token": "jwt_token",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- **Status Codes:**
  - 201: Created
  - 400: Bad Request

#### POST /captains/login
Logs in an existing captain.
- **Request Example:**
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "password123"
  }
  ```
- **Response Example:**
  ```json
  {
    "token": "jwt_token",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- **Status Codes:**
  - 200: OK
  - 400: Bad Request
  - 401: Unauthorized

#### GET /captains/profile
Retrieves the profile of the authenticated captain.
- **Response Example:**
  ```json
  {
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- **Status Codes:**
  - 200: OK
  - 401: Unauthorized

#### GET /captains/logout
Logs out the authenticated captain.
- **Response Example:**
  ```json
  {
    "message": "Logout successfully"
  }
  ```
- **Status Codes:**
  - 200: OK
  - 401: Unauthorized

## Models

### User Model
- **Fields:**
  - `fullName`: Object containing `firstName` and `lastName`
  - `email`: String, required, unique
  - `password`: String, required
  - `socketId`: String
- **Methods:**
  - `generateAuthToken`: Generates a JWT token
  - `comparePassword`: Compares a given password with the hashed password
  - `hashPassword`: Hashes a given password

### Captain Model
- **Fields:**
  - `fullname`: Object containing `firstname` and `lastname`
  - `email`: String, required, unique
  - `password`: String, required
  - `socketId`: String
  - `status`: String, enum ['active', 'inactive'], default 'inactive'
  - `vehicle`: Object containing `color`, `plate`, `capacity`, `vehicleType`
  - `location`: Object containing `ltd` and `lng`
- **Methods:**
  - `generateAuthToken`: Generates a JWT token
  - `comparePassword`: Compares a given password with the hashed password
  - `hashPassword`: Hashes a given password

### Blacklist Token Model
- **Fields:**
  - `token`: String, required, unique
  - `createdAt`: Date, default Date.now, expires in 24 hours

## Authentication Middlewares

### auth.middleware.js
Contains middleware functions for authenticating users and captains by verifying JWT tokens and checking if they are blacklisted.

- **authUser**: Verifies the JWT token for users, checks if it is blacklisted, and sets the user in the request object.
- **authCaptain**: Verifies the JWT token for captains, checks if it is blacklisted, and sets the captain in the request object.
