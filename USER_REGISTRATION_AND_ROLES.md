# User Registration and Role Management

## Overview

This document explains how to register new users, understand the role system, and manage user accounts in the SACOLA backend.

## User Roles

The system supports two user roles:

### 1. USER Role
- **Access Level**: Full access
- **Permissions**: Can create, read, update, and delete data
- **Default Role**: Yes (assigned when no role is specified during registration)

### 2. VIEWER Role
- **Access Level**: Read-only access
- **Permissions**: Can only view data, cannot create, edit, or delete
- **Use Case**: For stakeholders who need to monitor progress without making changes

## User Registration

### Endpoint
```
POST /auth/register
```

### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

### Required Fields
- `email`: Valid email address (unique)
- `password`: Minimum 8 characters

### Optional Fields
- `name`: Full name
- `firstName`: First name
- `lastName`: Last name
- `role`: User role (defaults to "user" if not specified)

### Example Registration Requests

#### Register a Full Access User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Developer",
    "role": "user"
  }'
```

#### Register a Read-Only Viewer
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "stakeholder@example.com",
    "password": "SecurePass123!",
    "firstName": "Jane",
    "lastName": "Stakeholder",
    "role": "viewer"
  }'
```

## Authentication Flow

### 1. Login
```
POST /auth/login
```
- Requires email and password
- Returns OTP sent to email

### 2. Verify OTP
```
POST /auth/verify-otp
```
- Requires email and OTP
- Returns JWT access token and refresh token

## Profile Management

### Get User Profile
```
GET /api/users/me
```
- Requires JWT authentication
- Returns user profile information

### Change Password
```
PUT /api/users/me/password
```
- Requires JWT authentication
- Requires current password, new password, and confirmation

### Delete Account
```
DELETE /api/users/me
```
- Requires JWT authentication
- Permanently deletes the user account

## Role-Based Access Control

### Using Roles in Controllers

To restrict endpoints based on roles, use the `@Roles()` decorator:

```typescript
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@Controller('example')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExampleController {
  
  // Only USER can access
  @Post()
  @Roles(UserRole.USER)
  create() {
    // Implementation
  }

  // Only USER can access
  @Put()
  @Roles(UserRole.USER)
  update() {
    // Implementation
  }

  // Only USER can access
  @Delete()
  @Roles(UserRole.USER)
  delete() {
    // Implementation
  }

  // VIEWER and USER can access
  @Get()
  @Roles(UserRole.VIEWER, UserRole.USER)
  findAll() {
    // Implementation
  }
}
```

### Role Hierarchy
1. **USER**: Full access to create, read, update, delete
2. **VIEWER**: Read-only access

## Security Considerations

1. **Password Requirements**: Minimum 8 characters
2. **Email Verification**: Required for account activation
3. **JWT Tokens**: Access tokens expire in 1 hour, refresh tokens in 10 hours
4. **OTP Verification**: Required for login (sent via email)
5. **Role Validation**: Server-side validation of user roles

## Error Handling

Common error responses:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid credentials or missing token
- `403 Forbidden`: Insufficient permissions for role
- `404 Not Found`: User not found
- `409 Conflict`: Email already exists

## Best Practices

1. **Role Assignment**: Assign the minimum required role for each user
2. **Password Security**: Use strong passwords and change them regularly
3. **Token Management**: Store tokens securely and refresh when needed
4. **Account Deletion**: Use the delete endpoint carefully as it's irreversible
5. **Role Updates**: Consider implementing role update functionality for admins

## API Documentation

For complete API documentation, visit the Swagger UI at:
```
http://localhost:3000/api-docs
```
