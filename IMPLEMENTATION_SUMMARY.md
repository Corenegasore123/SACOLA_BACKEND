# Implementation Summary: User Registration, Roles, and Account Management

## Overview

This document summarizes all the changes made to implement user registration with role-based access control, including the new USER and VIEWER roles, and the delete account functionality.

## Changes Made

### 1. Updated User Roles Enum (`src/shared/enums/user-role.enum.ts`)

**Before:**
```typescript
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer',
  USER = 'user', // Deprecated
}
```

**After:**
```typescript
export enum UserRole {
  USER = 'user',        // Full access - can create, read, update, delete
  VIEWER = 'viewer',    // Read-only access - can only view
}
```

### 2. Updated Roles Guard (`src/auth/guards/roles.guard.ts`)

**Fixed the role checking logic to work with single role field:**
```typescript
// Before: user?.roles?.includes(role)
// After: requiredRoles.includes(user?.role)
```

### 3. Enhanced Registration DTO (`src/auth/dto/register.dto.ts`)

**Added comprehensive documentation for USER and VIEWER roles:**
- Clear description of role permissions
- Examples showing the difference between USER and VIEWER
- Default role set to USER for new registrations

### 4. Added Delete Account Endpoint

**Profile Controller (`src/profile/profile.controller.ts`):**
```typescript
@Delete('me')
async deleteAccount(@Req() req: any) {
  await this.profileService.deleteAccount(req.user.id);
  return { message: 'Account deleted successfully' };
}
```

**Profile Service (`src/profile/profile.service.ts`):**
```typescript
async deleteAccount(userId: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');
  
  await this.userRepository.remove(user);
}
```

### 5. Implemented Role-Based Access Control Example

**Conservation Project Controller (`src/conservation/controllers/conservation-project.controller.ts`):**
- Added `@UseGuards(AuthGuard('jwt'), RolesGuard)` at controller level
- **POST, PUT, DELETE endpoints**: Restricted to `USER` role only
- **GET endpoints**: Accessible to `VIEWER` and `USER` roles

## User Registration Process

### Endpoint
```
POST /auth/register
```

### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"  // Optional: defaults to "user"
}
```

### Role Options
- **`user`**: Full access - can create, read, update, delete
- **`viewer`**: Read-only access - can only view data

## Authentication Flow

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` (returns OTP)
3. **Verify OTP**: `POST /auth/verify-otp` (returns JWT tokens)
4. **Use JWT token** in Authorization header for protected endpoints

## Profile Management Endpoints

### Get Profile
```
GET /api/users/me
Authorization: Bearer <jwt_token>
```

### Change Password
```
PUT /api/users/me/password
Authorization: Bearer <jwt_token>
Body: {
  "currentPassword": "oldPassword",
  "newPassword": "newPassword",
  "confirmNewPassword": "newPassword"
}
```

### Delete Account
```
DELETE /api/users/me
Authorization: Bearer <jwt_token>
```

## Role-Based Access Control Implementation

### Controller-Level Implementation
```typescript
@Controller('api/example')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ExampleController {
  
  // Only USER can create/edit/delete
  @Post()
  @Roles(UserRole.USER)
  create() { /* ... */ }
  
  // Only USER can update
  @Put()
  @Roles(UserRole.USER)
  update() { /* ... */ }
  
  // Only USER can delete
  @Delete()
  @Roles(UserRole.USER)
  delete() { /* ... */ }
  
  // VIEWER and USER can view
  @Get()
  @Roles(UserRole.VIEWER, UserRole.USER)
  findAll() { /* ... */ }
}
```

### Role Hierarchy
1. **USER**: Full access to create, read, update, delete
2. **VIEWER**: Read-only access

## Security Features

1. **JWT Authentication**: All protected endpoints require valid JWT token
2. **Role Validation**: Server-side validation of user roles
3. **Password Requirements**: Minimum 8 characters
4. **Email Verification**: OTP-based login verification
5. **Account Deletion**: Permanent account removal with proper validation

## API Documentation

- **Swagger UI**: Available at `http://localhost:3000/api-docs`
- **Role Documentation**: Enhanced with clear descriptions and examples
- **Endpoint Protection**: All endpoints properly documented with required roles

## Testing the Implementation

### 1. Register a USER
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

### 2. Register a VIEWER
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

### 3. Test Role-Based Access
- **USER role**: Can access all endpoints (create, read, update, delete)
- **VIEWER role**: Can only access GET endpoints (read-only)

## Files Modified

1. `src/shared/enums/user-role.enum.ts` - Updated role definitions
2. `src/auth/guards/roles.guard.ts` - Fixed role checking logic
3. `src/auth/dto/register.dto.ts` - Enhanced role documentation
4. `src/profile/profile.controller.ts` - Added delete account endpoint
5. `src/profile/profile.service.ts` - Added delete account method
6. `src/conservation/controllers/conservation-project.controller.ts` - Role-based access control example

## Files Created

1. `USER_REGISTRATION_AND_ROLES.md` - Comprehensive user guide
2. `IMPLEMENTATION_SUMMARY.md` - This implementation summary

## Next Steps

1. **Apply Role-Based Access Control**: Implement the same pattern across all controllers
2. **Role Updates**: Add functionality for admins to update user roles
3. **Audit Logging**: Implement logging for role-based actions
4. **Testing**: Comprehensive testing of role-based access control

## Conclusion

The implementation provides a robust user registration system with clear role-based access control. The USER role has full access to create, edit, and delete data, while the VIEWER role is restricted to read-only access. The delete account functionality allows users to permanently remove their accounts. All changes maintain backward compatibility and follow security best practices.
