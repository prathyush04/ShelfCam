# Staff.jsx - Staff Management Interface

## Overview
This component provides a comprehensive staff management interface for the ShelfCam system. It allows managers to view, add, edit, and manage staff members with features like search, filtering, and shelf assignments. The interface adapts based on user roles and provides both grid and modal-based interactions.

## Purpose
- **Primary Function**: Complete staff member management
- **Key Responsibilities**:
  - Display staff members in a searchable, filterable grid
  - Add new staff members with detailed information
  - Edit existing staff member details
  - Manage staff status (active/inactive)
  - Handle shelf assignments for staff members
  - Provide role-based access control

## Component Features

### Staff Management Operations
1. **View Staff**: Grid display with staff cards
2. **Add Staff**: Modal form for new staff creation
3. **Edit Staff**: Modify existing staff information
4. **Delete Staff**: Remove staff members from system
5. **Toggle Status**: Activate/deactivate staff accounts
6. **Search & Filter**: Find specific staff members

### Data Management
- **Real-time Updates**: Immediate UI updates after operations
- **Fallback Handling**: Graceful error handling with API failures
- **Local Storage**: Backup data storage for offline functionality
- **Validation**: Form validation for required fields

## State Management

### Core State
```jsx
const [staff, setStaff] = useState([]);
const [shelves, setShelves] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [editingStaff, setEditingStaff] = useState(null);
```

### Filter and Search State
```jsx
const [search, setSearch] = useState('');
const [filter, setFilter] = useState('all');
```

### Form State
```jsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  phone: '',
  role: 'staff',
  department: '',
  assigned_shelf: '',
  is_active: true
});
```

## API Integration

### Data Fetching
```jsx
const fetchStaff = async () => {
  try {
    // Try primary endpoint
    response = await api.get('/staff/');
  } catch (e) {
    // Fallback to alternative endpoint
    response = await api.get('/employees/');
  }
};
```

### Shelf Data
```jsx
const fetchShelves = async () => {
  const response = await api.get('/shelves/');
  const shelvesData = response.data.shelves || response.data || [];
  setShelves(shelvesData.filter(shelf => shelf.is_active));
};
```

## Staff Operations

### Add New Staff
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.username || !formData.email || !formData.role) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Duplicate check
  const isDuplicate = staff.some(member => 
    (member.username === formData.username || member.email === formData.email) &&
    (!editingStaff || member.id !== editingStaff.id)
  );
  
  if (isDuplicate) {
    alert('Username or email already exists.');
    return;
  }
  
  // Create staff member
  const submitData = {
    ...formData,
    id: editingStaff ? editingStaff.id : Date.now(),
    employee_id: editingStaff ? editingStaff.employee_id : `EMP${String(Date.now()).slice(-3)}`,
    created_at: editingStaff ? editingStaff.created_at : new Date().toISOString()
  };
};
```

### Edit Staff
```jsx
const handleEdit = (member) => {
  setEditingStaff(member);
  setFormData({
    username: member.username,
    email: member.email,
    phone: member.phone || '',
    role: member.role,
    department: member.department || '',
    assigned_shelf: member.assigned_shelf || '',
    is_active: member.is_active
  });
  setShowModal(true);
};
```

### Delete Staff
```jsx
const handleDelete = async (memberId) => {
  if (window.confirm('Are you sure you want to delete this staff member?')) {
    try {
      const updatedStaff = staff.filter(member => member.id !== memberId);
      setStaff(updatedStaff);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Error deleting staff member.');
    }
  }
};
```

### Toggle Status
```jsx
const toggleStatus = async (member) => {
  try {
    const updatedStaff = staff.map(m => 
      m.id === member.id ? { ...m, is_active: !m.is_active } : m
    );
    setStaff(updatedStaff);
  } catch (error) {
    console.error('Error toggling staff status:', error);
    alert('Error updating staff status.');
  }
};
```

## UI Components

### Staff Grid Display
```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {filteredStaff.map((member) => (
    <StaffCard key={member.id} member={member} />
  ))}
</div>
```

### Staff Card Component
Each staff card displays:
- **Profile Info**: Username, employee ID, role
- **Contact Info**: Email, phone number
- **Status**: Active/inactive indicator
- **Assignment**: Current shelf assignment
- **Actions**: Edit, delete, toggle status buttons

### Search and Filter Bar
```jsx
<div className="bg-white shadow rounded-lg p-4">
  <div className="flex flex-col sm:flex-row gap-4">
    <SearchInput />
    <FilterDropdown />
  </div>
</div>
```

### Modal Form
```jsx
{showModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <StaffForm />
    </div>
  </div>
)}
```

## Form Validation

### Required Fields
- **Username**: Must be unique
- **Email**: Must be unique and valid format
- **Role**: Must be selected from available options

### Validation Logic
```jsx
// Check for required fields
if (!formData.username || !formData.email || !formData.role) {
  alert('Please fill in all required fields.');
  return;
}

// Check for duplicates
const isDuplicate = staff.some(member => 
  (member.username === formData.username || member.email === formData.email) &&
  (!editingStaff || member.id !== editingStaff.id)
);
```

## Search and Filtering

### Search Implementation
```jsx
const filteredStaff = staff.filter(member => {
  const matchesSearch = member.username.toLowerCase().includes(search.toLowerCase()) ||
                       member.email.toLowerCase().includes(search.toLowerCase()) ||
                       member.employee_id.toLowerCase().includes(search.toLowerCase());
  
  if (filter === 'active') return matchesSearch && member.is_active;
  if (filter === 'inactive') return matchesSearch && !member.is_active;
  return matchesSearch;
});
```

### Filter Options
- **All Staff**: Show all staff members
- **Active Only**: Show only active staff
- **Inactive Only**: Show only inactive staff

## Role Management

### Role Color Coding
```jsx
const getRoleColor = (role) => {
  switch (role) {
    case 'area_manager': return 'bg-purple-100 text-purple-800';
    case 'store_manager': return 'bg-blue-100 text-blue-800';
    default: return 'bg-green-100 text-green-800';
  }
};
```

### Role-based Features
- **Staff**: Basic employee access
- **Store Manager**: Store-level management
- **Area Manager**: Multi-store management

## Shelf Assignment

### Assignment Display
```jsx
<div className="flex justify-between text-xs">
  <span className="text-gray-500 truncate">Assigned:</span>
  <span className="font-medium flex-shrink-0 ml-2">
    {member.assigned_shelf || 'None'}
  </span>
</div>
```

### Assignment Management
- **Dropdown Selection**: Choose from available shelves
- **Validation**: Ensure shelf exists and is active
- **Update Logic**: Handle assignment changes

## Error Handling

### API Error Handling
```jsx
try {
  const response = await api.get('/staff/');
  console.log('Staff API response:', response.data);
  const staffData = response.data.staff || response.data.employees || response.data || [];
  setStaff(staffData);
} catch (error) {
  console.error('Error fetching staff:', error);
  console.error('Error details:', error.response?.data);
  setStaff([]);
}
```

### User Feedback
- **Success Messages**: Confirm successful operations
- **Error Alerts**: Clear error messages for failures
- **Loading States**: Visual feedback during operations

## Responsive Design

### Grid Layout
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three column layout

### Modal Responsiveness
- **Mobile**: Full-width modal
- **Desktop**: Fixed-width centered modal

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Enter/Space**: Button activation
- **Escape**: Modal dismissal

### Screen Reader Support
- **Labels**: Proper form labels
- **ARIA Attributes**: Screen reader descriptions
- **Focus Management**: Clear focus indicators

## Performance Optimizations

### Efficient Rendering
- **Key Props**: Proper React keys for list items
- **Conditional Rendering**: Only render when needed
- **State Updates**: Batch updates where possible

### Data Management
- **Local Caching**: Store data in component state
- **Debounced Search**: Prevent excessive filtering
- **Lazy Loading**: Load data as needed

## Security Considerations

### Data Validation
- **Input Sanitization**: Clean user input
- **Duplicate Prevention**: Check for existing records
- **Role Validation**: Ensure valid role assignments

### Access Control
- **Authentication**: Verify user is logged in
- **Authorization**: Check user permissions
- **Data Protection**: Secure sensitive information

## Integration Points

### Backend API
- **GET /staff/**: Fetch staff members
- **GET /employees/**: Alternative staff endpoint
- **GET /shelves/**: Fetch available shelves
- **POST/PUT/DELETE**: Staff CRUD operations

### Other Components
- **Layout**: Navigation and user context
- **AuthContext**: User authentication state
- **Shelves**: Shelf assignment integration

## Future Enhancements

### Advanced Features
- **Bulk Operations**: Select and modify multiple staff
- **Import/Export**: CSV import/export functionality
- **Advanced Search**: Multi-field search criteria
- **Sorting**: Sort by different columns

### User Experience
- **Drag & Drop**: Drag staff to shelves for assignment
- **Inline Editing**: Edit directly in the grid
- **Keyboard Shortcuts**: Power user features
- **Undo/Redo**: Operation history

### Reporting
- **Staff Reports**: Generate staff reports
- **Performance Metrics**: Track staff productivity
- **Assignment History**: Track assignment changes
- **Audit Trail**: Log all staff operations

## Dependencies
- **React**: Core framework and hooks
- **AuthContext**: User authentication
- **API Utility**: HTTP request handling
- **Lucide React**: UI icons
- **CSS**: Styling and responsive design