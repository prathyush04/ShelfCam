# employee.py - Employee Database Model

## Overview
This SQLAlchemy model defines the Employee entity for the ShelfCam system. It represents staff members, managers, and administrators with their authentication credentials, contact information, and relationships to other system entities like staff assignments and alerts.

## Purpose
- **Primary Function**: Define employee data structure and relationships
- **Key Responsibilities**:
  - Store employee authentication credentials
  - Maintain employee contact and role information
  - Establish relationships with assignments and alerts
  - Support role-based access control
  - Track employee status (active/inactive)

## Model Structure

### Table Definition
```python
class Employee(Base):
    __tablename__ = "employees"
```

### Core Fields
```python
id = Column(Integer, primary_key=True, index=True)
employee_id = Column(String, unique=True, index=True)
username = Column(String, unique=True, index=True)
password = Column(String)  # Must match DB column
role = Column(String)
email = Column(String)
phone = Column(String)
is_active = Column(Boolean, default=True)
```

## Field Descriptions

### Primary Key
- **id**: Auto-incrementing integer primary key
- **Purpose**: Internal database identifier
- **Usage**: Foreign key references from other tables

### Authentication Fields
- **employee_id**: Unique employee identifier (e.g., "EMP001")
  - **Type**: String
  - **Constraints**: Unique, indexed
  - **Usage**: Login credential and external references

- **username**: Unique username for login
  - **Type**: String  
  - **Constraints**: Unique, indexed
  - **Usage**: Login credential and display name

- **password**: Employee password
  - **Type**: String
  - **Security**: Currently plain text (should be hashed)
  - **Usage**: Authentication verification

### Role and Permissions
- **role**: Employee role designation
  - **Type**: String
  - **Values**: "staff", "store_manager", "area_manager"
  - **Usage**: Access control and feature permissions

### Contact Information
- **email**: Employee email address
  - **Type**: String
  - **Usage**: Communication and notifications

- **phone**: Employee phone number
  - **Type**: String
  - **Usage**: Contact and emergency communication

### Status Management
- **is_active**: Account status flag
  - **Type**: Boolean
  - **Default**: True
  - **Usage**: Enable/disable employee accounts

## Relationships

### Staff Assignments
```python
# Assignments where this employee is assigned to shelves
assignments = relationship(
    "StaffAssignment", 
    foreign_keys="[StaffAssignment.employee_id]", 
    back_populates="employee"
)

# Assignments created by this employee (if manager)
assigned_assignments = relationship(
    "StaffAssignment", 
    foreign_keys="[StaffAssignment.assigned_by]", 
    back_populates="assigned_by_manager"
)
```

### Alert Management
```python
# Alert history records for this employee
alerts = relationship("AlertHistory", back_populates="employee")

# Alerts assigned to this employee
assigned_alerts = relationship("Alert", back_populates="assigned_staff")
```

## Role-Based Access Control

### Role Hierarchy
1. **staff**: Basic employees
   - View assigned alerts
   - Update alert status
   - Limited dashboard access

2. **store_manager**: Store-level managers
   - All staff permissions
   - Manage store inventory
   - Assign staff to shelves
   - Create and manage shelves
   - View store-wide reports

3. **area_manager**: Multi-store managers
   - All store manager permissions
   - Access multiple stores
   - View area-wide analytics
   - Manage store managers

### Permission Implementation
```python
# Example usage in API endpoints
from app.deps.roles import require_store_manager

@router.post("/inventory/")
def create_inventory_item(
    inventory_data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_store_manager)
):
    # Only store managers and above can create inventory
    pass
```

## Database Relationships

### One-to-Many Relationships
- **Employee → StaffAssignment**: One employee can have multiple assignments (historical)
- **Employee → AlertHistory**: One employee can have multiple alert actions
- **Employee → Alert**: One employee can be assigned multiple alerts

### Foreign Key References
- **StaffAssignment.employee_id** → Employee.employee_id
- **StaffAssignment.assigned_by** → Employee.employee_id
- **AlertHistory.performed_by** → Employee.employee_id
- **Alert.assigned_staff_id** → Employee.employee_id

## Usage Examples

### Creating an Employee
```python
from app.models.employee import Employee

# Create new employee
new_employee = Employee(
    employee_id="EMP001",
    username="john_doe",
    password="hashed_password",  # Should be hashed
    role="staff",
    email="john.doe@company.com",
    phone="+1234567890",
    is_active=True
)

db.add(new_employee)
db.commit()
```

### Querying Employees
```python
# Find by employee ID
employee = db.query(Employee).filter(
    Employee.employee_id == "EMP001"
).first()

# Find active staff members
active_staff = db.query(Employee).filter(
    Employee.role == "staff",
    Employee.is_active == True
).all()

# Find by username
user = db.query(Employee).filter(
    Employee.username == "john_doe"
).first()
```

### Authentication Query
```python
# Login verification (from auth.py)
user = db.query(Employee).filter(
    Employee.employee_id == data.employee_id,
    Employee.username == data.username,
    Employee.role == data.role
).first()

if user and user.password == data.password:
    # Authentication successful
    pass
```

## Security Considerations

### Password Security
```python
# Current implementation (INSECURE)
password = Column(String)  # Plain text storage

# Recommended implementation
from werkzeug.security import generate_password_hash, check_password_hash

# When creating/updating password
hashed_password = generate_password_hash(plain_password)
employee.password = hashed_password

# When verifying password
is_valid = check_password_hash(employee.password, provided_password)
```

### Data Protection
- **Unique Constraints**: Prevent duplicate usernames/employee_ids
- **Indexing**: Efficient lookups for authentication
- **Active Status**: Soft delete functionality
- **Role Validation**: Ensure valid roles are assigned

## Integration Points

### Authentication System
```python
# Used in app/api/routes/auth.py
from app.models.employee import Employee

@router.post("/auth/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(
        Employee.employee_id == data.employee_id,
        Employee.username == data.username,
        Employee.role == data.role
    ).first()
```

### Staff Management
```python
# Used in app/api/routes/staff.py
@router.get("/staff/")
def get_all_staff(db: Session = Depends(get_db)):
    staff = db.query(Employee).all()
    return {"staff": staff}
```

### Assignment System
```python
# Used in staff assignment operations
employee = db.query(Employee).filter(
    Employee.employee_id == assignment_data.employee_id,
    Employee.role == "staff",
    Employee.is_active == True
).first()
```

## Database Migration

### Table Creation
```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    is_active BOOLEAN DEFAULT 1
);

CREATE INDEX ix_employees_employee_id ON employees (employee_id);
CREATE INDEX ix_employees_username ON employees (username);
```

### Sample Data
```sql
INSERT INTO employees (employee_id, username, password, role, email, phone, is_active)
VALUES 
    ('EMP001', 'john_doe', 'password123', 'staff', 'john@company.com', '123-456-7890', 1),
    ('MGR001', 'jane_smith', 'manager123', 'store_manager', 'jane@company.com', '123-456-7891', 1),
    ('AREA001', 'bob_wilson', 'area123', 'area_manager', 'bob@company.com', '123-456-7892', 1);
```

## Performance Considerations

### Indexing Strategy
- **employee_id**: Indexed for fast authentication lookups
- **username**: Indexed for login queries
- **role**: Consider indexing for role-based queries
- **is_active**: Consider composite index with role

### Query Optimization
```python
# Efficient authentication query
user = db.query(Employee).filter(
    Employee.employee_id == employee_id,
    Employee.is_active == True
).first()

# Avoid N+1 queries with relationships
employees_with_assignments = db.query(Employee).options(
    joinedload(Employee.assignments)
).all()
```

## Validation and Constraints

### Model Validation
```python
from pydantic import BaseModel, validator

class EmployeeCreate(BaseModel):
    employee_id: str
    username: str
    password: str
    role: str
    email: str
    phone: Optional[str] = None
    
    @validator('role')
    def validate_role(cls, v):
        valid_roles = ['staff', 'store_manager', 'area_manager']
        if v not in valid_roles:
            raise ValueError(f'Role must be one of: {valid_roles}')
        return v
    
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not v.startswith('EMP') and not v.startswith('MGR'):
            raise ValueError('Employee ID must start with EMP or MGR')
        return v
```

## Future Enhancements

### Security Improvements
- **Password Hashing**: Implement bcrypt or similar
- **Password Policies**: Enforce strong passwords
- **Account Lockout**: Prevent brute force attacks
- **Two-Factor Auth**: Additional security layer

### Additional Fields
- **created_at**: Track account creation
- **updated_at**: Track last modification
- **last_login**: Track login activity
- **department**: Organizational structure
- **manager_id**: Hierarchical relationships

### Advanced Features
- **Profile Pictures**: Store employee photos
- **Permissions**: Granular permission system
- **Preferences**: User-specific settings
- **Audit Trail**: Track all employee changes

## Dependencies
- **SQLAlchemy**: ORM framework
- **Database**: SQLite/PostgreSQL backend
- **Related Models**: StaffAssignment, Alert, AlertHistory