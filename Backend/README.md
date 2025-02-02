# Uber Clone Project Backend

## API Documentation

### POST /users/register

#### Description
This endpoint is used to register a new user.

#### Request Body
The request body must be a JSON object containing the following fields:
- `fullName`: An object containing:
  - `firstName` (string, required): The first name of the user. Must be at least 3 characters long.
  - `lastName` (string, required): The last name of the user. Must be at least 3 characters long.
- `email` (string, required): The email address of the user. Must be a valid email format.
- `password` (string, required): The password for the user. Must be at least 8 characters long.

#### Example Request
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

#### Responses

##### Success (201)
- **Description**: User successfully registered.
- **Body**: A JSON object containing the JWT token and user details.
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    // ...other user fields...
  }
}
```

##### Client Error (400)
- **Description**: Validation error or user already exists.
- **Body**: A JSON object containing the error message.
```json
{
  "error": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```
or
```json
{
  "message": "User already exists"
}
```

##### Server Error (500)
- **Description**: Internal server error.
- **Body**: A JSON object containing the error message.
```json
{
  "message": "Internal server error"
}
```

### POST /users/login

#### Description
This endpoint is used to log in an existing user.

#### Request Body
The request body must be a JSON object containing the following fields:
- `email` (string, required): The email address of the user. Must be a valid email format.
- `password` (string, required): The password for the user. Must be at least 8 characters long.

#### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Responses

##### Success (200)
- **Description**: User successfully logged in.
- **Body**: A JSON object containing the JWT token and user details.
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    // ...other user fields...
  }
}
```

##### Client Error (400)
- **Description**: Validation error or invalid email/password.
- **Body**: A JSON object containing the error message.
```json
{
  "error": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```
or
```json
{
  "message": "Invalid Email or Password"
}
```

##### Server Error (500)
- **Description**: Internal server error.
- **Body**: A JSON object containing the error message.
```json
{
  "message": "Internal server error"
}
```

## Middlewares

### auth.middleware.js

#### authUser
This middleware is used to authenticate the user by verifying the JWT token. It checks for the token in the cookies or the `Authorization` header. If the token is valid, it attaches the user object to the request and calls the next middleware. If the token is invalid or not present, it returns a 401 Unauthorized error.

```javascript
const userModel = require('../Models/user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);  
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
}
```
