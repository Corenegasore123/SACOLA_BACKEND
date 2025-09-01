/**
 * User roles for access control throughout the application
 */
export enum UserRole {
  // User with full access to do everything and edit
  USER = 'user',
  // Viewer with read-only access (can only view)
  VIEWER = 'viewer',
}
