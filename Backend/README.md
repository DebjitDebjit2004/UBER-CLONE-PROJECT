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
