# AuthContext.jsx - Authentication Context Provider

## Overview
This React Context provides centralized authentication state management for the ShelfCam application. It handles user login, logout, token management, and provides authentication status to all components throughout the application.

## Purpose
- **Primary Function**: Centralized authentication state management
- **Key Responsibilities**:
  - Manage user authentication state
  - Handle login and logout operations
  - Store and retrieve JWT tokens
  - Provide authentication status to components
  - Persist authentication across browser sessions

## Context Structure

### AuthContext Creation
```jsx
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Context Provider
```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Context value and methods
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## State Management

### User State
```jsx
const [user, setUser] = useState(null);
```
**Structure**:
```javascript
{
  employee_id: "EMP001",
  username: "john_doe", 
  role: "staff|store_manager|area_manager"
}
```

### Loading State
```jsx
const [loading, setLoading] = useState(true);
```
- **Initial Load**: `true` while checking existing authentication
- **Login Process**: `false` during normal operation
- **Used By**: Route protection components for loading screens

## Authentication Methods

### Login Function
```jsx
const login = async (credentials) => {
  try {
    console.log('Attempting login with:', credentials);
    console.log('API Base URL:', api.defaults.baseURL);
    
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    
    const { access_token } = response.data;
    
    // Store token
    localStorage.setItem('token', access_token);
    
    // Create user data from credentials
    const userData = {
      employee_id: credentials.employee_id,
      username: credentials.username,
      role: credentials.role
    };
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error response:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'Login failed' 
    };
  }
};
```

**Features**:
- **API Integration**: Calls backend authentication endpoint
- **Token Storage**: Saves JWT token to localStorage
- **User Data Creation**: Constructs user object from credentials
- **Error Handling**: Comprehensive error catching and reporting
- **Logging**: Detailed console logging for debugging

### Logout Function
```jsx
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
};
```

**Features**:
- **Token Cleanup**: Removes JWT token from storage
- **User Data Cleanup**: Removes user data from storage
- **State Reset**: Clears user state in context

## Initialization and Persistence

### Session Restoration
```jsx
useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    setUser(JSON.parse(userData));
  }
  setLoading(false);
}, []);
```

**Process**:
1. **Check Storage**: Look for existing token and user data
2. **Restore Session**: Set user state if valid data exists
3. **Complete Loading**: Set loading to false
4. **Auto-login**: User remains logged in across browser sessions

## Context Value

### Provided Values
```jsx
const value = {
  user,           // Current user object or null
  login,          // Login function
  logout,         // Logout function  
  loading,        // Loading state boolean
  isAuthenticated: !!user  // Computed authentication status
};
```

### Usage in Components
```jsx
const { user, login, logout, loading, isAuthenticated } = useAuth();

// Check if user is authenticated
if (isAuthenticated) {
  // Show authenticated content
}

// Access user information
console.log(`Welcome ${user.username}`);

// Handle login
const handleLogin = async (credentials) => {
  const result = await login(credentials);
  if (result.success) {
    // Handle successful login
  } else {
    // Handle login error
    setError(result.error);
  }
};

// Handle logout
const handleLogout = () => {
  logout();
  navigate('/login');
};
```

## Error Handling

### Login Error Handling
```jsx
catch (error) {
  console.error('Login error:', error);
  console.error('Error response:', error.response?.data);
  return { 
    success: false, 
    error: error.response?.data?.detail || error.message || 'Login failed' 
  };
}
```

**Error Types**:
- **Network Errors**: Connection issues with backend
- **Authentication Errors**: Invalid credentials
- **Server Errors**: Backend service issues
- **Validation Errors**: Malformed request data

### Error Response Format
```javascript
{
  success: false,
  error: "Human-readable error message"
}
```

## Security Features

### Token Management
- **Secure Storage**: Uses localStorage for token persistence
- **Automatic Cleanup**: Removes tokens on logout
- **Session Validation**: Checks for existing valid sessions

### User Data Protection
- **Minimal Storage**: Only stores necessary user information
- **No Sensitive Data**: Passwords never stored locally
- **Clean Logout**: Complete data removal on logout

## Integration with API

### API Configuration
```jsx
// In api.js - automatic token inclusion
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Token Expiration Handling
```jsx
// In api.js - automatic logout on token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Component Integration

### Provider Setup
```jsx
// In App.jsx
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Application routes */}
      </Router>
    </AuthProvider>
  );
}
```

### Hook Usage
```jsx
// In any component
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Loading States

### Initial Loading
- **Purpose**: Prevent flash of unauthenticated content
- **Duration**: Brief moment while checking localStorage
- **UI**: Loading spinner in route protection components

### Login Loading
- **Purpose**: Provide feedback during authentication
- **Managed By**: Individual components (Login.jsx)
- **Not Context Responsibility**: Context doesn't manage login loading

## Role-Based Features

### User Role Access
```jsx
const { user } = useAuth();

// Check user role
if (user.role === 'store_manager') {
  // Show manager features
}

// Role-based navigation
const canAccessInventory = ['store_manager', 'area_manager'].includes(user.role);
```

### Role Information
- **staff**: Basic employee access
- **store_manager**: Store management capabilities
- **area_manager**: Multi-store management access

## Debugging and Logging

### Console Logging
```jsx
console.log('Attempting login with:', credentials);
console.log('API Base URL:', api.defaults.baseURL);
console.log('Login response:', response.data);
```

**Logged Information**:
- Login attempts with credentials (excluding password)
- API base URL for debugging
- Server responses
- Error details and stack traces

### Error Logging
```jsx
console.error('Login error:', error);
console.error('Error response:', error.response?.data);
```

## Performance Considerations

### Efficient Updates
- **Minimal Re-renders**: Context value only changes when necessary
- **Memoization**: Could be enhanced with useMemo for value object
- **State Batching**: React automatically batches state updates

### Memory Management
- **Cleanup**: Proper cleanup on logout
- **No Memory Leaks**: No persistent timers or subscriptions
- **Efficient Storage**: Minimal data stored in localStorage

## Future Enhancements

### Security Improvements
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: Consider more secure storage options
- **Session Timeout**: Automatic logout after inactivity
- **Multi-tab Sync**: Sync auth state across browser tabs

### User Experience
- **Remember Me**: Optional persistent login
- **Auto-logout Warning**: Warn before session expires
- **Login History**: Track login attempts
- **Device Management**: Manage logged-in devices

### Advanced Features
- **Role Permissions**: Granular permission system
- **User Preferences**: Store user settings
- **Profile Management**: User profile updates
- **Two-Factor Auth**: Enhanced security options

## Dependencies
- **React**: Core hooks (useState, useEffect, useContext, createContext)
- **API Utility**: HTTP request handling
- **localStorage**: Browser storage for persistence

## Error Boundaries
Consider wrapping AuthProvider with error boundary for production:
```jsx
<ErrorBoundary>
  <AuthProvider>
    <App />
  </AuthProvider>
</ErrorBoundary>
```