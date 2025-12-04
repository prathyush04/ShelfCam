# api.js - HTTP Client Configuration and Interceptors

## Overview
This module configures and exports an Axios HTTP client instance for the ShelfCam frontend application. It handles API communication with the backend, automatic token management, and authentication error handling.

## Purpose
- **Primary Function**: Centralized HTTP client configuration
- **Key Responsibilities**:
  - Configure base API settings and endpoints
  - Automatically attach JWT tokens to requests
  - Handle authentication token expiration
  - Provide consistent error handling across the application
  - Manage CORS and request/response interceptors

## Configuration

### Base Configuration
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Features**:
- **Environment-based URL**: Uses Vite environment variables
- **Fallback URL**: Defaults to localhost:8000 for development
- **JSON Content Type**: Sets default content type for requests
- **Axios Instance**: Creates isolated axios instance for the app

### Environment Variables
```bash
# .env file
VITE_API_BASE_URL=http://localhost:8000  # Development
VITE_API_BASE_URL=https://api.shelfcam.com  # Production
```

## Request Interceptor

### Automatic Token Attachment
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Functionality**:
- **Token Retrieval**: Gets JWT token from localStorage
- **Authorization Header**: Adds Bearer token to all requests
- **Conditional Addition**: Only adds header if token exists
- **Request Modification**: Modifies request config before sending

### Request Flow
1. **Component makes API call**: `api.get('/shelves/')`
2. **Interceptor runs**: Checks for stored token
3. **Token attachment**: Adds Authorization header if token exists
4. **Request sent**: Modified request sent to backend
5. **Backend validation**: Server validates JWT token

## Response Interceptor

### Token Expiration Handling
```javascript
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

**Error Handling**:
- **Success Passthrough**: Successful responses pass through unchanged
- **401 Detection**: Catches unauthorized responses
- **Token Cleanup**: Removes invalid tokens from storage
- **User Cleanup**: Removes user data from storage
- **Automatic Redirect**: Forces navigation to login page
- **Error Propagation**: Re-throws error for component handling

### Response Flow
1. **API response received**: Backend sends response
2. **Interceptor evaluation**: Checks response status
3. **Success path**: Normal responses pass through
4. **401 handling**: Unauthorized responses trigger cleanup
5. **Automatic logout**: User redirected to login
6. **Component handling**: Components receive error or success

## Usage Examples

### Basic API Calls
```javascript
import api from '../utils/api';

// GET request
const response = await api.get('/shelves/');
const shelves = response.data.shelves;

// POST request
const newShelf = await api.post('/shelves/', {
  name: 'Shelf A1',
  category: 'Electronics',
  capacity: 100
});

// PUT request
const updatedShelf = await api.put('/shelves/1', {
  name: 'Updated Shelf A1',
  capacity: 150
});

// DELETE request
await api.delete('/shelves/1');
```

### File Upload
```javascript
// FormData for file uploads
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('shelf_number', 'A1');

const response = await api.post('/detect/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Error Handling in Components
```javascript
const fetchData = async () => {
  try {
    const response = await api.get('/inventory/');
    setInventory(response.data.inventory);
  } catch (error) {
    if (error.response?.status === 401) {
      // User will be automatically redirected to login
      console.log('Authentication expired');
    } else {
      // Handle other errors
      setError(error.response?.data?.detail || 'Failed to fetch data');
    }
  }
};
```

## Authentication Integration

### Token Management
```javascript
// Login process (in AuthContext)
const response = await api.post('/auth/login', credentials);
const { access_token } = response.data;
localStorage.setItem('token', access_token);

// Subsequent requests automatically include token
const protectedData = await api.get('/staff-assignments/');
```

### Logout Process
```javascript
// Manual logout (in AuthContext)
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Next API call will not include Authorization header
};

// Automatic logout (via interceptor)
// Happens automatically on 401 responses
```

## Error Types and Handling

### HTTP Status Codes
- **200-299**: Success responses (pass through)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (token expired/invalid)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (backend issues)

### Error Response Structure
```javascript
// Typical error response from backend
{
  "detail": "Invalid credentials. Please check employee ID, username, password, or role."
}

// Accessing error in components
catch (error) {
  const errorMessage = error.response?.data?.detail || 'An error occurred';
  setError(errorMessage);
}
```

## Security Features

### Token Security
- **Bearer Token Format**: Standard JWT bearer token format
- **Automatic Attachment**: No manual token management needed
- **Secure Storage**: Uses localStorage (consider httpOnly cookies for production)
- **Automatic Cleanup**: Removes invalid tokens immediately

### CORS Handling
- **Backend Configuration**: Backend must allow frontend origin
- **Credentials**: Supports credential-based requests
- **Headers**: Proper header handling for cross-origin requests

### Request Security
- **HTTPS Support**: Works with HTTPS endpoints
- **Content Type**: Proper content type headers
- **Error Sanitization**: Doesn't expose sensitive error details

## Development vs Production

### Development Configuration
```javascript
// Development
const API_BASE_URL = 'http://localhost:8000';

// Features:
// - CORS enabled for localhost
// - Detailed error logging
// - Hot reload support
```

### Production Configuration
```javascript
// Production
const API_BASE_URL = 'https://api.shelfcam.com';

// Features:
// - HTTPS endpoints
// - Restricted CORS origins
// - Error logging to monitoring service
// - Rate limiting
```

## Performance Considerations

### Request Optimization
- **Single Instance**: One axios instance for entire app
- **Connection Reuse**: HTTP connection pooling
- **Timeout Configuration**: Can add request timeouts
- **Retry Logic**: Can implement automatic retries

### Caching Strategies
```javascript
// Can add response caching
api.interceptors.response.use((response) => {
  // Cache GET responses
  if (response.config.method === 'get') {
    // Implement caching logic
  }
  return response;
});
```

## Debugging and Monitoring

### Request Logging
```javascript
// Add request logging for debugging
api.interceptors.request.use((config) => {
  console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
  return config;
});

// Add response logging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`Error from ${error.config?.url}:`, error.response?.status);
    return Promise.reject(error);
  }
);
```

### Error Monitoring
```javascript
// Production error monitoring
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Send errors to monitoring service
    if (process.env.NODE_ENV === 'production') {
      errorMonitoringService.captureException(error);
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
```

## Future Enhancements

### Advanced Features
- **Request Retry**: Automatic retry for failed requests
- **Request Queuing**: Queue requests when offline
- **Response Caching**: Cache responses for better performance
- **Request Deduplication**: Prevent duplicate simultaneous requests

### Security Improvements
- **Token Refresh**: Automatic token renewal
- **Request Signing**: Sign requests for additional security
- **Rate Limiting**: Client-side rate limiting
- **CSRF Protection**: Cross-site request forgery protection

### Monitoring and Analytics
- **Performance Metrics**: Track API response times
- **Error Analytics**: Detailed error reporting
- **Usage Analytics**: Track API usage patterns
- **Health Checks**: Monitor API availability

## Dependencies
- **Axios**: HTTP client library
- **Vite**: Build tool for environment variables
- **localStorage**: Browser storage API
- **Window Location**: Browser navigation API

## Integration Points
- **AuthContext**: Authentication state management
- **All Components**: Used throughout the application
- **Backend API**: Communicates with FastAPI backend
- **Environment Config**: Uses Vite environment variables