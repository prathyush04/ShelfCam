# Login.jsx - User Authentication Page

## Overview
This component provides the user interface for employee authentication in the ShelfCam system. It handles multi-factor login with employee ID, username, password, and role selection, featuring a modern, responsive design with comprehensive error handling.

## Purpose
- **Primary Function**: User authentication interface
- **Key Responsibilities**:
  - Collect and validate login credentials
  - Handle authentication requests to backend
  - Provide user feedback for login attempts
  - Support role-based authentication
  - Redirect users after successful login

## Component Features

### Form Fields
1. **Employee ID**: Unique identifier for each employee
2. **Username**: User's login name
3. **Password**: User's password with show/hide toggle
4. **Role**: Dropdown selection (staff, store_manager, area_manager)

### User Experience Features
- **Password Visibility Toggle**: Eye icon to show/hide password
- **Loading States**: Visual feedback during authentication
- **Error Display**: Clear error messages for failed attempts
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Proper labels and keyboard navigation

## State Management

### Form State
```jsx
const [formData, setFormData] = useState({
  employee_id: '',
  username: '',
  password: '',
  role: 'staff'  // Default role
});
```

### UI State
```jsx
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

## Authentication Flow

### Login Process
1. **Form Validation**: Ensures all fields are filled
2. **API Request**: Sends credentials to `/auth/login` endpoint
3. **Response Handling**: Processes success or error responses
4. **Token Storage**: Saves JWT token to localStorage
5. **User Data Storage**: Stores user info for app context
6. **Navigation**: Redirects to dashboard on success

### Error Handling
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const result = await login(formData);
  
  if (result.success) {
    navigate('/dashboard');
  } else {
    setError(result.error);
  }
  
  setLoading(false);
};
```

## UI Components

### Form Structure
```jsx
<form onSubmit={handleSubmit}>
  <EmployeeIdField />
  <UsernameField />
  <PasswordFieldWithToggle />
  <RoleSelector />
  <SubmitButton />
</form>
```

### Error Display
```jsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded-md p-4">
    <div className="flex">
      <AlertCircle className="h-5 w-5 text-red-400" />
      <div className="ml-3">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    </div>
  </div>
)}
```

### Password Toggle
```jsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? (
    <EyeOff className="h-5 w-5 text-gray-400" />
  ) : (
    <Eye className="h-5 w-5 text-gray-400" />
  )}
</button>
```

## Styling and Design

### Layout
- **Centered Design**: Full-screen centered login form
- **Card Layout**: Clean white card on gray background
- **Responsive**: Adapts to different screen sizes
- **Brand Colors**: Blue accent colors for ShelfCam branding

### Visual Elements
- **Logo Area**: ShelfCam branding and description
- **Form Fields**: Consistent styling with focus states
- **Button States**: Loading and disabled states
- **Icons**: Lucide React icons for visual enhancement

### CSS Classes
```jsx
// Main container
style={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9fafb',
  padding: '0 1rem'
}}

// Form styling
className="mt-1 block w-full px-3 py-2 border border-gray-300 
rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
```

## Role Selection

### Available Roles
```jsx
<select name="role" value={formData.role} onChange={handleChange}>
  <option value="staff">Staff</option>
  <option value="store_manager">Store Manager</option>
  <option value="area_manager">Area Manager</option>
</select>
```

**Role Descriptions**:
- **Staff**: Basic employees with limited access
- **Store Manager**: Store-level management access
- **Area Manager**: Multi-store management access

## Integration with AuthContext

### Login Function Usage
```jsx
const { login } = useAuth();
const navigate = useNavigate();

const result = await login(formData);
```

### Authentication Response
```jsx
// Success response
{
  success: true
}

// Error response
{
  success: false,
  error: "Invalid credentials. Please check employee ID, username, password, or role."
}
```

## Security Features

### Input Validation
- **Required Fields**: All fields must be filled
- **Client-side Validation**: Basic validation before submission
- **Server-side Validation**: Backend validates credentials

### Password Security
- **Hidden by Default**: Password field type="password"
- **Toggle Visibility**: Optional password reveal
- **No Storage**: Password not stored in component state after submission

### Error Messages
- **Generic Errors**: Doesn't reveal which field is incorrect
- **Rate Limiting**: Backend should implement rate limiting
- **Account Lockout**: Backend should handle failed attempts

## Accessibility Features

### Form Accessibility
- **Labels**: Proper labels for all form fields
- **ARIA Attributes**: Screen reader support
- **Keyboard Navigation**: Tab order and keyboard shortcuts
- **Focus Management**: Clear focus indicators

### Error Accessibility
- **Error Announcements**: Screen readers can announce errors
- **Color Independence**: Errors not conveyed by color alone
- **Clear Language**: Simple, understandable error messages

## Performance Considerations

### Optimization
- **Minimal Re-renders**: Efficient state updates
- **Form Validation**: Client-side validation reduces server requests
- **Loading States**: Prevents multiple submissions

### Network Efficiency
- **Single Request**: One API call for authentication
- **Token Caching**: Stores auth token for future requests
- **Error Handling**: Graceful handling of network issues

## Error Scenarios

### Common Errors
1. **Invalid Credentials**: Wrong employee ID, username, or password
2. **Inactive Account**: Account disabled by administrator
3. **Network Error**: Connection issues with backend
4. **Server Error**: Backend service unavailable

### Error Display
```jsx
// Error types and messages
const errorMessages = {
  'Invalid credentials': 'Please check your employee ID, username, password, and role.',
  'Account inactive': 'Your account has been deactivated. Contact your administrator.',
  'Network error': 'Unable to connect to server. Please try again.',
  'Server error': 'Server is temporarily unavailable. Please try again later.'
};
```

## Usage Example

### Component Usage
```jsx
// Used in App.jsx as a public route
<Route 
  path="/login" 
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  } 
/>
```

### User Interaction Flow
1. **Page Load**: User sees login form
2. **Fill Fields**: Enter employee ID, username, password, select role
3. **Submit**: Click "Sign in" button
4. **Loading**: Button shows "Signing in..." with disabled state
5. **Success**: Redirect to dashboard
6. **Error**: Display error message, allow retry

## Future Enhancements

### Security Improvements
- **Two-Factor Authentication**: SMS or email verification
- **Password Strength**: Requirements and validation
- **Remember Me**: Optional persistent login
- **Biometric Login**: Fingerprint or face recognition

### User Experience
- **Auto-complete**: Browser password manager integration
- **Social Login**: Integration with company SSO
- **Password Recovery**: Forgot password functionality
- **Login History**: Show last login information

### Accessibility
- **High Contrast Mode**: Better visibility options
- **Font Size Options**: Adjustable text size
- **Voice Input**: Speech-to-text for form fields
- **Multi-language**: Internationalization support

## Dependencies
- **React**: Core framework and hooks
- **React Router**: Navigation after login
- **AuthContext**: Authentication state management
- **Lucide React**: Icons for UI elements
- **CSS**: Styling and responsive design