# ShelfCam - AI-Powered Retail Shelf Monitoring System

## Project Overview

ShelfCam is a comprehensive retail management system that combines AI-powered computer vision with modern web technologies to monitor and manage store shelves, inventory, and staff assignments. The system provides real-time alerts, automated inventory tracking, and role-based management interfaces for retail operations.

## System Architecture

### Backend (FastAPI + SQLAlchemy)
- **Framework**: FastAPI with Python 3.8+
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy with Alembic migrations
- **Authentication**: JWT-based authentication
- **AI Integration**: Computer vision for shelf monitoring
- **API Documentation**: Automatic OpenAPI/Swagger documentation

### Frontend (React + Vite)
- **Framework**: React 18 with modern hooks
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router v6 for client-side navigation
- **State Management**: React Context API
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React icon library
- **HTTP Client**: Axios for API communication

## Core Features

### 1. AI-Powered Shelf Monitoring
- **Image Processing**: Upload shelf images for AI analysis
- **Stock Level Detection**: Automatic inventory level assessment
- **Item Recognition**: Identify products and their locations
- **Alert Generation**: Create alerts based on detection results
- **Empty Space Detection**: Calculate shelf utilization percentages

### 2. Alert Management System
- **Real-time Alerts**: Immediate notifications for shelf issues
- **Priority Levels**: Critical, High, Medium, Low priority classification
- **Alert Types**: Low stock, out of stock, misplaced items
- **Workflow Management**: Active → Acknowledged → Resolved status flow
- **Staff Assignment**: Automatic and manual alert assignment
- **History Tracking**: Complete audit trail of alert actions

### 3. Inventory Management
- **Product Tracking**: Comprehensive product information storage
- **Stock Levels**: Current quantity and threshold management
- **Shelf Assignment**: Link products to specific shelf locations
- **Category Management**: Organize products by categories
- **Capacity Planning**: Monitor shelf capacity utilization
- **CRUD Operations**: Full create, read, update, delete functionality

### 4. Staff Management
- **Employee Profiles**: Store staff information and credentials
- **Role-Based Access**: Staff, Store Manager, Area Manager roles
- **Shelf Assignments**: Assign staff members to specific shelves
- **Status Management**: Active/inactive employee status
- **Contact Information**: Email and phone number storage
- **Authentication**: Secure login with multiple credential verification

### 5. Shelf Management
- **Shelf Configuration**: Create and configure store shelves
- **Capacity Management**: Set and monitor shelf capacity limits
- **Category Assignment**: Organize shelves by product categories
- **Status Control**: Enable/disable shelves as needed
- **Staff Assignment**: Link staff members to shelf responsibilities
- **Inventory Integration**: Connect shelves to inventory items

### 6. Dashboard and Analytics
- **Role-Based Dashboards**: Different views for different user roles
- **Real-time Statistics**: Live data on shelves, staff, and alerts
- **Performance Metrics**: Track system usage and efficiency
- **Quick Actions**: Fast access to common operations
- **Visual Indicators**: Charts and graphs for data visualization

## User Roles and Permissions

### Staff
- **Access**: Limited to assigned alerts and basic dashboard
- **Capabilities**:
  - View assigned alerts
  - Acknowledge and resolve alerts
  - View assigned shelf information
  - Update alert status

### Store Manager
- **Access**: Full store management capabilities
- **Capabilities**:
  - All staff permissions
  - Manage store inventory
  - Create and manage shelves
  - Assign staff to shelves
  - View store-wide analytics
  - Manage staff members

### Area Manager
- **Access**: Multi-store management capabilities
- **Capabilities**:
  - All store manager permissions
  - Access multiple stores
  - View area-wide reports
  - Manage store managers
  - System-wide analytics

## Technology Stack

### Backend Technologies
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM for Python
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **Uvicorn**: ASGI server for running FastAPI applications
- **Python-multipart**: File upload handling
- **CORS**: Cross-Origin Resource Sharing support

### Frontend Technologies
- **React**: JavaScript library for building user interfaces
- **Vite**: Next generation frontend tooling
- **React Router**: Declarative routing for React
- **Axios**: Promise-based HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful & consistent icon toolkit
- **Context API**: Built-in React state management

### Development Tools
- **ESLint**: JavaScript linting utility
- **Prettier**: Code formatter
- **Git**: Version control system
- **VS Code**: Recommended development environment
- **Postman**: API testing and documentation

## Database Schema

### Core Tables
1. **employees**: Staff member information and authentication
2. **shelves**: Shelf configuration and metadata
3. **inventory**: Product information and stock levels
4. **alerts**: Alert records and status tracking
5. **staff_assignments**: Staff-to-shelf assignment relationships
6. **alert_history**: Audit trail for alert actions

### Relationships
- **Employee ↔ StaffAssignment**: Many-to-many through assignments
- **Shelf ↔ StaffAssignment**: One-to-many relationship
- **Employee ↔ Alert**: One-to-many for assigned alerts
- **Shelf ↔ Inventory**: One-to-many for shelf products
- **Alert ↔ AlertHistory**: One-to-many for action history

## API Endpoints

### Authentication
- `POST /auth/login`: User authentication and token generation

### Staff Management
- `GET /staff/`: List all staff members
- `GET /employees/`: Alternative staff endpoint

### Shelf Management
- `GET /shelves/`: List all shelves
- `POST /shelves/`: Create new shelf
- `PUT /shelves/{id}`: Update shelf information
- `DELETE /shelves/{id}`: Delete shelf

### Inventory Management
- `GET /inventory/`: List all inventory items
- `POST /inventory/`: Create new inventory item
- `PUT /inventory/{id}`: Update inventory item
- `DELETE /inventory/{id}`: Delete inventory item

### Alert Management
- `POST /alerts/process`: Process AI detection results
- `GET /alerts/active`: Get active alerts
- `GET /alerts/dashboard/{employee_id}`: Get employee dashboard
- `POST /alerts/acknowledge/{id}`: Acknowledge alert
- `POST /alerts/resolve/{id}`: Resolve alert

### Staff Assignments
- `GET /staff-assignments/`: List all assignments
- `POST /staff-assignments/assign`: Create new assignment
- `DELETE /staff-assignments/{id}`: Remove assignment

### AI Detection
- `POST /detect/`: Upload image for AI analysis

## Installation and Setup

### Backend Setup
```bash
cd ShelfCam-Backend-main
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd shelfcam-frontend
npm install
npm run dev
```

### Environment Configuration
Create `.env` files in both backend and frontend directories with appropriate configuration values.

## Development Workflow

### Backend Development
1. **Model Changes**: Update SQLAlchemy models
2. **API Endpoints**: Create/modify FastAPI routes
3. **Testing**: Test endpoints with Postman or automated tests
4. **Documentation**: Update API documentation

### Frontend Development
1. **Component Development**: Create/modify React components
2. **State Management**: Update context providers
3. **API Integration**: Connect components to backend APIs
4. **Styling**: Apply Tailwind CSS classes
5. **Testing**: Test user interactions and flows

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Different permissions for different roles
- **Token Expiration**: Automatic token expiration handling
- **Secure Storage**: Client-side token storage best practices

### Data Security
- **Input Validation**: Server-side validation of all inputs
- **SQL Injection Prevention**: ORM-based database queries
- **CORS Configuration**: Proper cross-origin request handling
- **Error Handling**: Secure error messages without sensitive data

## Performance Considerations

### Backend Performance
- **Database Indexing**: Optimized database queries
- **Pagination**: Large dataset handling
- **Caching**: Response caching where appropriate
- **Async Operations**: Non-blocking request handling

### Frontend Performance
- **Code Splitting**: Lazy loading of components
- **State Optimization**: Efficient state updates
- **Image Optimization**: Optimized image handling
- **Bundle Size**: Minimized JavaScript bundle size

## Deployment

### Backend Deployment
- **Production Server**: Gunicorn or similar WSGI server
- **Database**: PostgreSQL for production
- **Environment Variables**: Secure configuration management
- **Monitoring**: Application performance monitoring

### Frontend Deployment
- **Build Process**: Vite production build
- **Static Hosting**: CDN or static file server
- **Environment Configuration**: Production API endpoints
- **Caching**: Browser caching optimization

## Future Enhancements

### AI and Machine Learning
- **Advanced Detection**: Improved computer vision algorithms
- **Predictive Analytics**: Forecast inventory needs
- **Anomaly Detection**: Identify unusual patterns
- **Real-time Processing**: Live video stream analysis

### User Experience
- **Mobile App**: Native mobile applications
- **Real-time Notifications**: WebSocket-based notifications
- **Advanced Analytics**: Comprehensive reporting dashboard
- **Offline Support**: Offline functionality for mobile users

### System Integration
- **ERP Integration**: Connect with existing ERP systems
- **POS Integration**: Point-of-sale system integration
- **Supplier Integration**: Automated reordering systems
- **IoT Sensors**: Integration with IoT shelf sensors

### Scalability
- **Microservices**: Break down into smaller services
- **Load Balancing**: Handle increased traffic
- **Database Sharding**: Scale database horizontally
- **Cloud Deployment**: Cloud-native architecture

## Contributing

### Development Guidelines
1. **Code Style**: Follow established coding conventions
2. **Testing**: Write tests for new features
3. **Documentation**: Update documentation for changes
4. **Version Control**: Use meaningful commit messages

### Getting Started
1. **Fork Repository**: Create your own fork
2. **Setup Environment**: Follow installation instructions
3. **Create Branch**: Create feature branch for changes
4. **Submit PR**: Submit pull request with changes

## Support and Documentation

### Documentation Structure
- **API Documentation**: Automatic Swagger/OpenAPI docs
- **Component Documentation**: Individual README files
- **Setup Guides**: Installation and configuration guides
- **User Manuals**: End-user documentation

### Getting Help
- **Issue Tracking**: GitHub issues for bug reports
- **Feature Requests**: Enhancement suggestions
- **Community Support**: Developer community forums
- **Professional Support**: Commercial support options