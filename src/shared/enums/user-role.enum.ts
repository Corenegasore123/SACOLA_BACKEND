/**
 * User roles for access control throughout the application
 */
export enum UserRole {
  // System administrator with full access
  ADMIN = 'admin',
  // Project manager with elevated permissions
  MANAGER = 'manager',
  // Regular user with read-only access
  VIEWER = 'viewer',
  // Deprecated: Kept for backward compatibility
  USER = 'user',
}
