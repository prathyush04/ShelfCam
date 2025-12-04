# alerts.py - Alert Management API Routes

## Overview
This comprehensive module manages the alert system for ShelfCam, handling everything from alert creation through resolution. It processes AI-generated alerts from shelf monitoring and provides a complete workflow for staff to manage inventory issues.

## Purpose
- **Primary Function**: Complete alert lifecycle management
- **Key Responsibilities**:
  - Process JSON data from AI detection to create alerts
  - Provide dashboard views for different user roles
  - Handle alert acknowledgment and resolution
  - Maintain alert history and statistics
  - Support bulk operations for efficiency

## Core Features

### Alert Processing
- **AI Integration**: Processes detection results from uploaded images
- **Smart Alert Generation**: Creates appropriate alerts based on shelf conditions
- **Data Validation**: Ensures JSON structure and data types are correct
- **Error Handling**: Comprehensive error management with detailed logging

### Alert Management
- **Status Tracking**: Active → Acknowledged → Resolved workflow
- **Priority System**: Critical, High, Medium, Low priority levels
- **Staff Assignment**: Automatic and manual staff assignment to alerts
- **History Tracking**: Complete audit trail of all alert actions

## API Endpoints

### POST /process
**Purpose**: Process alerts from uploaded JSON detection results

**Request**: Multipart form with JSON file
**Expected JSON Structure**:
```json
{
  "shelf_number": "A1",
  "empty_percentage": 75.5,
  "items_detected": [
    {
      "product_name": "Product A",
      "quantity": 5,
      "location": "rack_1"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Alerts processed successfully",
  "alerts_created": 2,
  "success": true,
  "warnings": ["Optional warning messages"]
}
```

### GET /active
**Purpose**: Get active alerts with filtering options

**Query Parameters**:
- `employee_id`: Filter by assigned employee
- `priority`: Filter by priority level
- `alert_type`: Filter by alert type
- `shelf_name`: Filter by shelf
- `limit`: Maximum results (1-500)

**Response**:
```json
{
  "success": true,
  "alerts": [alert_objects],
  "count": 10,
  "total_active": 25
}
```

### GET /dashboard/{employee_id}
**Purpose**: Get personalized dashboard data for specific employee

**Response**:
```json
{
  "success": true,
  "employee": {
    "employee_id": "EMP001",
    "username": "john_doe",
    "role": "staff"
  },
  "alerts": [assigned_alerts],
  "statistics": {alert_stats},
  "count": 5
}
```

### POST /acknowledge/{alert_id}
**Purpose**: Acknowledge an alert (mark as seen/being handled)

**Query Parameters**:
- `employee_id`: ID of employee acknowledging alert

**Response**:
```json
{
  "success": true,
  "message": "Alert acknowledged successfully"
}
```

### POST /resolve/{alert_id}
**Purpose**: Mark alert as resolved (issue fixed)

**Query Parameters**:
- `employee_id`: ID of employee resolving alert

**Response**:
```json
{
  "success": true,
  "message": "Alert resolved successfully"
}
```

### GET /history/{alert_id}
**Purpose**: Get complete history of actions for specific alert

**Response**:
```json
{
  "success": true,
  "alert": {alert_details},
  "history": [
    {
      "id": 1,
      "action": "acknowledged",
      "performed_by": "EMP001",
      "notes": "Looking into this issue",
      "timestamp": "2024-01-15T10:30:00"
    }
  ],
  "count": 3
}
```

### GET /statistics
**Purpose**: Get comprehensive alert statistics

**Response**:
```json
{
  "success": true,
  "statistics": {
    "total_alerts": 150,
    "active_alerts": 25,
    "resolved_alerts": 100,
    "acknowledged_alerts": 25,
    "critical_alerts": 5,
    "alerts_by_shelf": {...},
    "alerts_by_type": {...}
  }
}
```

### GET /
**Purpose**: Get all alerts with advanced filtering and pagination

**Query Parameters**:
- `status`: Filter by status
- `priority`: Filter by priority
- `alert_type`: Filter by type
- `shelf_name`: Filter by shelf
- `employee_id`: Filter by assigned employee
- `limit`: Results per page (1-500)
- `offset`: Skip results for pagination

### GET /{alert_id}
**Purpose**: Get detailed information about specific alert

**Response**:
```json
{
  "success": true,
  "alert": {
    "id": 123,
    "title": "Low Stock Alert",
    "message": "Shelf A1 is running low on inventory",
    "status": "active",
    "priority": "high",
    "shelf_name": "A1",
    "assigned_employee": {employee_info},
    "recent_history": [recent_actions]
  }
}
```

### Bulk Operations

#### POST /bulk-acknowledge
**Purpose**: Acknowledge multiple alerts at once

**Request Body**:
```json
{
  "alert_ids": [1, 2, 3, 4],
  "employee_id": "EMP001"
}
```

#### POST /bulk-resolve
**Purpose**: Resolve multiple alerts at once

**Request Body**:
```json
{
  "alert_ids": [1, 2, 3],
  "employee_id": "EMP001"
}
```

### GET /shelf/{shelf_name}
**Purpose**: Get all alerts for specific shelf

**Query Parameters**:
- `status`: Optional status filter

## Alert Types and Priorities

### Alert Types (AlertType Enum)
- `LOW_STOCK`: Inventory below minimum threshold
- `MEDIUM_STOCK`: Inventory at medium levels
- `HIGH_STOCK`: Inventory above maximum threshold
- `CRITICAL_STOCK`: Critically low inventory
- `OUT_OF_STOCK`: No inventory detected
- `MISPLACED_ITEM`: Items in wrong location

### Alert Status (AlertStatus Enum)
- `ACTIVE`: New alert requiring attention
- `ACKNOWLEDGED`: Alert seen and being handled
- `RESOLVED`: Issue fixed and alert closed
- `PENDING`: Alert waiting for processing

### Alert Priority (AlertPriority Enum)
- `CRITICAL`: Immediate attention required
- `HIGH`: High priority, handle soon
- `MEDIUM`: Normal priority
- `LOW`: Low priority, handle when convenient

## Data Processing Logic

### JSON Validation
1. **File Type Check**: Ensures uploaded file is JSON
2. **Structure Validation**: Checks required fields exist
3. **Data Type Validation**: Verifies correct data types
4. **Content Validation**: Ensures meaningful data values

### Alert Generation Logic
The `AlertService` processes detection data and creates appropriate alerts based on:
- **Empty Percentage**: Triggers stock level alerts
- **Item Detection**: Identifies misplaced or missing items
- **Shelf Capacity**: Compares against shelf configuration
- **Historical Data**: Considers previous alerts to avoid duplicates

## Error Handling

### Validation Errors
- **400 Bad Request**: Invalid JSON format or missing fields
- **400 Bad Request**: Invalid data types or values

### Processing Errors
- **500 Internal Server Error**: Alert processing failures
- **404 Not Found**: Employee or alert not found
- **403 Forbidden**: Insufficient permissions

### Logging
- Comprehensive logging of all operations
- Error details for debugging
- Success metrics for monitoring

## Database Integration

### Models Used
- **Alert**: Main alert records
- **AlertHistory**: Action history tracking
- **Employee**: User information and assignments
- **Shelf**: Shelf configuration data

### Relationships
- Alerts linked to employees (assigned_staff_id)
- History records linked to alerts and employees
- Shelf information for context

## Security Features
- **Employee Validation**: Ensures valid employee before operations
- **Permission Checks**: Verifies user can perform actions
- **Data Sanitization**: Validates all input data
- **Audit Trail**: Complete history of all actions

## Integration Points
- **AI Detection Service**: Receives processed detection results
- **Frontend Dashboard**: Provides data for alert displays
- **Staff Management**: Links alerts to employee assignments
- **Notification System**: Can trigger notifications (future feature)

## Performance Considerations
- **Pagination**: Limits large result sets
- **Filtering**: Reduces data transfer
- **Bulk Operations**: Efficient multi-alert handling
- **Caching**: Statistics can be cached for performance

## Usage Examples

### Processing Detection Results
```python
# Upload detection results
files = {'file': open('detection_results.json', 'rb')}
response = requests.post('/alerts/process', files=files)
```

### Getting Dashboard Data
```javascript
// Get alerts for staff dashboard
const response = await api.get(`/alerts/dashboard/${employeeId}`);
const { alerts, statistics } = response.data;
```

### Bulk Alert Management
```javascript
// Acknowledge multiple alerts
await api.post('/alerts/bulk-acknowledge', {
  alert_ids: [1, 2, 3, 4],
  employee_id: 'EMP001'
});
```

## Future Enhancements
- Real-time notifications via WebSocket
- Advanced analytics and reporting
- Machine learning for alert prioritization
- Integration with inventory management systems
- Mobile app support for field staff