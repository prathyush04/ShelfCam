# ShelfCam Documentation Index

This directory contains comprehensive documentation for every file in the ShelfCam project. Each README file provides detailed explanations of the code, its purpose, functionality, and integration points.

## Project Overview
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete system overview, architecture, and features

## Backend Documentation

### Main Application
- **[main.py](backend/main.py.md)** - FastAPI application entry point and configuration

### API Routes
- **[auth.py](backend/api/auth.py.md)** - Authentication and JWT token management
- **[alerts.py](backend/api/alerts.py.md)** - Comprehensive alert management system
- **[detect.py](backend/api/detect.py.md)** - AI detection and image processing
- **[inventory.py](backend/api/inventory.py.md)** - Inventory management operations
- **[shelf.py](backend/api/shelf.py.md)** - Shelf configuration and management
- **[staff.py](backend/api/staff.py.md)** - Staff member data retrieval
- **[staff_assignment.py](backend/api/staff_assignment.py.md)** - Staff-to-shelf assignments
- **[staff_dashboard.py](backend/api/staff_dashboard.py.md)** - Staff dashboard data
- **[role_protected.py](backend/api/role_protected.py.md)** - Role-based access control

### Core Services
- **[config.py](backend/core/config.py.md)** - Application configuration management
- **[auth.py](backend/core/auth.py.md)** - Authentication utilities and role management
- **[jwt_token.py](backend/core/jwt_token.py.md)** - JWT token creation and validation
- **[db.py](backend/database/db.py.md)** - Database connection and session management

### Database Models
- **[employee.py](backend/models/employee.py.md)** - Employee/staff database model
- **[shelf.py](backend/models/shelf.py.md)** - Shelf configuration model
- **[inventory.py](backend/models/inventory.py.md)** - Inventory item model
- **[alert.py](backend/models/alert.py.md)** - Alert system models
- **[user.py](backend/models/user.py.md)** - User authentication schemas
- **[staff_assignment.py](backend/models/staff_assignment.py.md)** - Staff assignment model
- **[alert_history.py](backend/models/alert_history.py.md)** - Alert action history

### Services
- **[alert_service.py](backend/services/alert_service.py.md)** - Alert processing and management
- **[auth_service.py](backend/services/auth_service.py.md)** - Authentication business logic
- **[model_runner.py](backend/services/model_runner.py.md)** - AI model execution service
- **[ai_inference.py](backend/services/ai_inference.py.md)** - AI inference processing
- **[notification_service.py](backend/services/notification_service.py.md)** - Notification handling
- **[websocket_service.py](backend/services/websocket_service.py.md)** - Real-time communication

### Schemas
- **[alert.py](backend/schemas/alert.py.md)** - Alert data validation schemas
- **[employee.py](backend/schemas/employee.py.md)** - Employee data schemas
- **[inventory.py](backend/schemas/inventory.py.md)** - Inventory validation schemas
- **[shelf.py](backend/schemas/shelf.py.md)** - Shelf data schemas
- **[staff_assignment.py](backend/schemas/staff_assignment.py.md)** - Assignment schemas
- **[response.py](backend/schemas/response.py.md)** - API response schemas

### Dependencies and Roles
- **[roles.py](backend/deps/roles.py.md)** - Role-based access control dependencies

### CRUD Operations
- **[inventory.py](backend/crud/inventory.py.md)** - Inventory CRUD operations

### Database Management
- **[create_tables.py](backend/migrations/create_tables.py.md)** - Database table creation
- **[create_db.py](backend/database/create_db.py.md)** - Database initialization
- **[test_db.py](backend/database/test_db.py.md)** - Database testing utilities

## Frontend Documentation

### Main Application
- **[App.jsx](frontend/App.jsx.md)** - Main React application and routing
- **[main.jsx](frontend/main.jsx.md)** - React application entry point

### Pages
- **[Login.jsx](frontend/pages/Login.jsx.md)** - User authentication interface
- **[Dashboard.jsx](frontend/pages/Dashboard.jsx.md)** - Main dashboard with analytics
- **[Staff.jsx](frontend/pages/Staff.jsx.md)** - Staff management interface
- **[Shelves.jsx](frontend/pages/Shelves.jsx.md)** - Shelf management interface
- **[Inventory.jsx](frontend/pages/Inventory.jsx.md)** - Inventory management interface
- **[Alerts.jsx](frontend/pages/Alerts.jsx.md)** - Alert monitoring and management
- **[Detection.jsx](frontend/pages/Detection.jsx.md)** - AI detection and image upload

### Components
- **[Layout.jsx](frontend/components/Layout.jsx.md)** - Application layout and navigation

### Context and State Management
- **[AuthContext.jsx](frontend/context/AuthContext.jsx.md)** - Authentication state management

### Utilities
- **[api.js](frontend/utils/api.js.md)** - HTTP client configuration and interceptors

### Configuration Files
- **[package.json](frontend/package.json.md)** - Frontend dependencies and scripts
- **[vite.config.js](frontend/vite.config.js.md)** - Vite build configuration
- **[eslint.config.js](frontend/eslint.config.js.md)** - ESLint configuration
- **[tsconfig.json](frontend/tsconfig.json.md)** - TypeScript configuration

### Styling
- **[App.css](frontend/App.css.md)** - Application-wide styles
- **[index.css](frontend/index.css.md)** - Global styles and Tailwind imports

## Additional Files

### AI and Machine Learning
- **[best.pt](backend/nmmodel/best.pt.md)** - Trained AI model weights
- **[mock_detection.py](backend/nmmodel/mock_detection.py.md)** - Mock detection for testing
- **[old1.py](backend/nmmodel/old1.py.md)** - Legacy model implementation

### Scripts and Utilities
- **[edge_sync.py](backend/scripts/edge_sync.py.md)** - Edge device synchronization
- **[clear_data.py](clear_data.py.md)** - Data cleanup utility
- **[test_login.py](test_login.py.md)** - Login functionality testing

### Database Scripts
- **[check_users.py](backend/database/check_users.py.md)** - User verification utility
- **[insert_sqlite_users.py](backend/database/insert_sqlite_users.py.md)** - SQLite user insertion
- **[insert_test_users.py](backend/database/insert_test_users.py.md)** - Test user creation
- **[postgresql_config.sql](backend/database/postgresql_config.sql.md)** - PostgreSQL setup

### Testing and Debugging
- **[check_employee_table.py](backend/check_employee_table.py.md)** - Employee table verification
- **[debug_jwt.py](backend/debug_jwt.py.md)** - JWT token debugging
- **[test_backend.html](test_backend.html.md)** - Backend API testing interface

### Configuration Files
- **[requirements.txt](backend/requirements.txt.md)** - Python dependencies
- **[requirements_clean.txt](backend/requirements_clean.txt.md)** - Cleaned Python dependencies
- **[.env](backend/.env.md)** - Backend environment variables
- **[.env](frontend/.env.md)** - Frontend environment variables

## Documentation Structure

Each README file follows a consistent structure:

1. **Overview** - Brief description of the file's purpose
2. **Purpose** - Primary function and key responsibilities
3. **Code Structure** - Detailed breakdown of the implementation
4. **API/Interface** - Public interfaces and usage examples
5. **Integration Points** - How it connects with other components
6. **Security Considerations** - Security features and considerations
7. **Performance** - Performance characteristics and optimizations
8. **Future Enhancements** - Planned improvements and extensions
9. **Dependencies** - Required libraries and modules

## How to Use This Documentation

### For Developers
- **New Team Members**: Start with PROJECT_OVERVIEW.md for system understanding
- **Feature Development**: Reference specific component documentation
- **Bug Fixes**: Use documentation to understand component interactions
- **Code Reviews**: Verify implementations against documented specifications

### For System Administrators
- **Deployment**: Reference configuration and setup documentation
- **Monitoring**: Understand system components for effective monitoring
- **Troubleshooting**: Use component documentation to diagnose issues
- **Maintenance**: Follow documented procedures for system maintenance

### For Project Managers
- **Feature Planning**: Understand system capabilities and limitations
- **Resource Allocation**: Identify complex components requiring more resources
- **Risk Assessment**: Understand system dependencies and potential issues
- **Progress Tracking**: Use documentation to verify feature completeness

## Maintenance

This documentation should be updated whenever:
- New features are added
- Existing functionality is modified
- Dependencies are changed
- Configuration requirements change
- Security considerations evolve

## Contributing to Documentation

When updating documentation:
1. **Keep it Current**: Update documentation with code changes
2. **Be Comprehensive**: Include all relevant details
3. **Use Examples**: Provide practical usage examples
4. **Consider Audience**: Write for different skill levels
5. **Cross-Reference**: Link related components and concepts

## Getting Help

If you need clarification on any component:
1. **Check Related Files**: Look at integration points and dependencies
2. **Review Code Comments**: Check inline code documentation
3. **Test Functionality**: Run the component to understand behavior
4. **Ask Team Members**: Consult with other developers familiar with the code

## Version Information

- **Documentation Version**: 1.0
- **Last Updated**: January 2024
- **Covers Code Version**: Current main branch
- **Next Review Date**: Quarterly updates recommended