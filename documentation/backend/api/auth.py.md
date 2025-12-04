# auth.py - Authentication API Routes

## Overview
This module handles user authentication for the ShelfCam system. It provides login functionality with JWT token generation for employees with different roles (staff, store_manager, area_manager).

## Purpose
- **Primary Function**: Authenticate users and generate JWT access tokens
- **Key Responsibilities**:
  - Validate employee credentials (employee_id, username, password, role)
  - Check user account status (active/inactive)
  - Generate JWT tokens for authenticated sessions
  - Handle authentication errors and security

## API Endpoints

### POST /auth/login
**Purpose**: Authenticate user and return JWT token

**Request Body** (LoginRequest):
```json
{
  "employee_id": "string",
  "username": "string", 
  "password": "string",
  "role": "staff|store_manager|area_manager"
}
```

**Response** (TokenResponse):
```json
{
  "access_token": "jwt_token_string",
  "token_type": "bearer"
}
```

**Authentication Process**:
1. **Multi-field Validation**: Checks employee_id, username, password, AND role
2. **Database Query**: Searches for user matching ALL provided credentials
3. **Password Verification**: Direct password comparison (plain text)
4. **Account Status Check**: Ensures user account is active
5. **Token Generation**: Creates JWT with employee_id and role claims

## Security Features

### Credential Validation
- **Multi-factor Authentication**: Requires 4 pieces of information
- **Role-based Access**: Validates user role during login
- **Account Status**: Prevents login for inactive accounts

### Error Handling
- **401 Unauthorized**: Invalid credentials or password mismatch
- **403 Forbidden**: Account is inactive
- **Detailed Error Messages**: Helps users understand authentication failures

### JWT Token Structure
```json
{
  "sub": "employee_id",
  "role": "user_role",
  "exp": "expiration_timestamp"
}
```

## Database Integration
- **Model**: Uses `Employee` model from `app.models.employee`
- **Query**: Filters by employee_id, username, role, and password
- **Session**: Uses SQLAlchemy session dependency

## Dependencies
- **FastAPI**: HTTP exception handling and routing
- **SQLAlchemy**: Database ORM and session management
- **JWT Token Service**: Token creation from `app.core.jwt_token`
- **Pydantic Schemas**: Request/response validation

## Code Flow
1. **Request Validation**: Pydantic validates incoming login data
2. **Database Lookup**: Query employee table with all credentials
3. **Credential Check**: Verify password matches stored value
4. **Status Verification**: Ensure account is active
5. **Token Creation**: Generate JWT with user claims
6. **Response**: Return token and type to client

## Security Considerations
- **Password Storage**: Currently uses plain text (should be hashed)
- **Token Expiration**: Configurable via JWT settings
- **Role Validation**: Ensures users can only access appropriate features
- **Session Management**: Stateless JWT-based authentication

## Integration Points
- **Frontend**: Receives and stores JWT tokens
- **Protected Routes**: Other API endpoints validate these tokens
- **User Context**: Token payload provides user identity and permissions

## Error Responses
- **Invalid Credentials**: "Invalid credentials. Please check employee ID, username, password, or role."
- **Inactive Account**: "Account is inactive. Contact admin."
- **Missing Fields**: Automatic validation errors from Pydantic

## Usage Example
```javascript
// Frontend login request
const response = await api.post('/auth/login', {
  employee_id: 'EMP001',
  username: 'john_doe',
  password: 'password123',
  role: 'staff'
});

// Store token for future requests
localStorage.setItem('token', response.data.access_token);
```

## Future Improvements
- Implement password hashing (bcrypt)
- Add refresh token mechanism
- Implement rate limiting for login attempts
- Add multi-factor authentication
- Log authentication attempts for security monitoring