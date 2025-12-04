# detect.py - AI Detection API Routes

## Overview
This module provides the API endpoint for AI-powered shelf detection and analysis. It handles image uploads, runs computer vision models on shelf images, processes the results, and automatically generates alerts based on the detection findings.

## Purpose
- **Primary Function**: AI-powered shelf image analysis
- **Key Responsibilities**:
  - Accept and process uploaded shelf images
  - Run computer vision models for object detection
  - Generate structured detection results
  - Create alerts based on detection findings
  - Provide feedback on detection success/failure

## Core Functionality

### Image Processing Pipeline
1. **Image Upload**: Receive multipart form data with image file
2. **File Validation**: Ensure valid image format and size
3. **File Storage**: Save uploaded image to designated directory
4. **AI Processing**: Run computer vision model on the image
5. **Result Processing**: Parse detection results into structured format
6. **Alert Generation**: Create alerts based on detection findings
7. **Response**: Return processing results and alert information

## API Endpoint

### POST /detect/
**Purpose**: Upload shelf image for AI analysis and alert generation

**Request Parameters**:
- **file**: Uploaded image file (multipart/form-data)
- **shelf_number**: Shelf identifier (default: "A1")

**Request Example**:
```python
# Using requests library
files = {'file': open('shelf_image.jpg', 'rb')}
data = {'shelf_number': 'A1'}
response = requests.post('/detect/', files=files, data=data)
```

**Response Format**:
```json
{
  "success": true,
  "alerts_created": 2,
  "alerts": [
    {
      "id": 123,
      "alert_type": "low_stock",
      "priority": "high",
      "shelf_name": "A1",
      "message": "Low stock detected on shelf A1"
    }
  ],
  "warnings": ["Optional warning messages"]
}
```

## Implementation Details

### File Handling
```python
@router.post("/detect/")
async def detect_and_alert(
    file: UploadFile = File(...),
    shelf_number: str = "A1",
    db: Session = Depends(get_db)
):
    try:
        # Create upload directory if it doesn't exist
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        
        # Save uploaded file
        upload_path = UPLOAD_DIR / file.filename
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
```

**Features**:
- **Directory Creation**: Automatically creates upload directory
- **File Streaming**: Efficiently handles large image files
- **Path Management**: Uses pathlib for cross-platform compatibility
- **Error Handling**: Graceful handling of file system errors

### AI Model Integration
```python
# Run computer vision model
success = run_model_on_image(str(upload_path), shelf_number)
if not success:
    raise HTTPException(status_code=500, detail="Model failed")

# Check for output file
if not OUTPUT_JSON.exists():
    raise HTTPException(status_code=500, detail="output.json not found")

# Load detection results
with open(OUTPUT_JSON, "r") as f:
    data = json.load(f)
```

**Process Flow**:
1. **Model Execution**: Calls external model runner function
2. **Success Validation**: Ensures model completed successfully
3. **Output Verification**: Checks for expected output file
4. **Result Loading**: Parses JSON detection results
5. **Error Handling**: Comprehensive error checking at each step

### Alert Processing
```python
# Process detection results into alerts
alert_service = AlertService(db)
result = alert_service.process_json_data(data)

return {
    "success": True,
    "alerts_created": result["alerts_created"],
    "alerts": result["alerts"],
    "warnings": result["errors"]
}
```

**Alert Generation**:
- **Service Integration**: Uses AlertService for consistent alert creation
- **Data Processing**: Converts detection data to alert format
- **Result Aggregation**: Combines all processing results
- **Warning Handling**: Includes non-critical warnings in response

## File System Structure

### Directory Configuration
```python
UPLOAD_DIR = Path("static/uploads")
OUTPUT_JSON = Path("static/outputs/output.json")
```

**Directory Layout**:
```
static/
├── uploads/           # Uploaded images
│   ├── image1.jpg
│   ├── image2.png
│   └── ...
└── outputs/           # AI model outputs
    ├── output.json    # Detection results
    └── output.jpg     # Annotated image (optional)
```

### File Management
- **Upload Storage**: Images stored in `static/uploads/`
- **Result Storage**: Detection results in `static/outputs/`
- **File Naming**: Preserves original filename
- **Cleanup**: Manual cleanup required (future enhancement)

## AI Model Integration

### Model Runner Interface
```python
from app.services.model_runner import run_model_on_image

# Function signature
def run_model_on_image(image_path: str, shelf_number: str) -> bool:
    """
    Run AI model on uploaded image
    
    Args:
        image_path: Path to uploaded image file
        shelf_number: Identifier for the shelf being analyzed
        
    Returns:
        bool: True if model ran successfully, False otherwise
    """
```

### Expected Output Format
```json
{
  "shelf_number": "A1",
  "empty_percentage": 75.5,
  "items_detected": [
    {
      "product_name": "Product A",
      "quantity": 5,
      "location": "rack_1",
      "confidence": 0.95
    }
  ],
  "analysis_timestamp": "2024-01-15T10:30:00Z",
  "model_version": "v1.2.0"
}
```

## Error Handling

### File Upload Errors
```python
try:
    upload_path = UPLOAD_DIR / file.filename
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
except Exception as e:
    raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
```

### Model Execution Errors
```python
success = run_model_on_image(str(upload_path), shelf_number)
if not success:
    raise HTTPException(status_code=500, detail="Model failed")
```

### Output Processing Errors
```python
if not OUTPUT_JSON.exists():
    raise HTTPException(status_code=500, detail="output.json not found")

try:
    with open(OUTPUT_JSON, "r") as f:
        data = json.load(f)
except json.JSONDecodeError:
    raise HTTPException(status_code=500, detail="Invalid JSON output")
```

## Security Considerations

### File Upload Security
- **File Type Validation**: Should validate image file types
- **File Size Limits**: Should implement file size restrictions
- **Path Traversal**: Uses pathlib to prevent path traversal attacks
- **Virus Scanning**: Consider adding virus scanning for uploads

### Input Validation
```python
# Recommended enhancements
@router.post("/detect/")
async def detect_and_alert(
    file: UploadFile = File(...),
    shelf_number: str = "A1",
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files allowed")
    
    # Validate file size (e.g., 10MB limit)
    if file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Validate shelf number format
    if not re.match(r'^[A-Z]\d+$', shelf_number):
        raise HTTPException(status_code=400, detail="Invalid shelf number format")
```

## Performance Considerations

### File Handling Performance
- **Streaming**: Uses file streaming for large images
- **Memory Efficiency**: Doesn't load entire file into memory
- **Disk Space**: Accumulates uploaded files (needs cleanup strategy)

### Model Performance
- **Processing Time**: AI model execution can be slow
- **Resource Usage**: High CPU/GPU usage during processing
- **Concurrency**: May need queuing for multiple simultaneous requests

### Optimization Strategies
```python
# Async processing (future enhancement)
import asyncio
from celery import Celery

@router.post("/detect/")
async def detect_and_alert_async(
    file: UploadFile = File(...),
    shelf_number: str = "A1",
    db: Session = Depends(get_db)
):
    # Save file
    upload_path = await save_uploaded_file(file)
    
    # Queue AI processing
    task = process_image_async.delay(str(upload_path), shelf_number)
    
    return {
        "success": True,
        "task_id": task.id,
        "message": "Processing started, check status with task_id"
    }
```

## Integration Points

### AlertService Integration
```python
from app.services.alert_service import AlertService

alert_service = AlertService(db)
result = alert_service.process_json_data(data)
```

**Benefits**:
- **Consistent Alert Creation**: Uses same logic as other alert sources
- **Database Integration**: Proper database session handling
- **Error Handling**: Centralized alert processing errors

### Model Service Integration
```python
from app.services.model_runner import run_model_on_image

# Model service handles:
# - Loading AI models
# - Image preprocessing
# - Running inference
# - Generating structured output
```

## Usage Examples

### Frontend Integration
```javascript
// React component usage
const handleImageUpload = async (file, shelfNumber) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('shelf_number', shelfNumber);
  
  try {
    const response = await api.post('/detect/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log(`Created ${response.data.alerts_created} alerts`);
    return response.data;
  } catch (error) {
    console.error('Detection failed:', error.response?.data?.detail);
    throw error;
  }
};
```

### Python Client Usage
```python
import requests

# Upload image for detection
def detect_shelf_issues(image_path, shelf_number):
    with open(image_path, 'rb') as f:
        files = {'file': f}
        data = {'shelf_number': shelf_number}
        
        response = requests.post(
            'http://localhost:8000/detect/',
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Detection successful: {result['alerts_created']} alerts created")
            return result
        else:
            print(f"Detection failed: {response.text}")
            return None
```

## Future Enhancements

### Advanced AI Features
- **Real-time Processing**: WebSocket-based real-time detection
- **Batch Processing**: Process multiple images simultaneously
- **Model Versioning**: Support multiple AI model versions
- **Confidence Thresholds**: Configurable detection confidence levels

### File Management
- **Automatic Cleanup**: Remove old uploaded files
- **Cloud Storage**: Store files in cloud storage (S3, GCS)
- **Image Optimization**: Resize/compress images before processing
- **Metadata Extraction**: Extract EXIF data from images

### API Enhancements
- **Async Processing**: Background task processing
- **Progress Tracking**: Real-time processing progress
- **Webhook Notifications**: Notify external systems of results
- **Batch Endpoints**: Process multiple images in one request

### Monitoring and Analytics
- **Processing Metrics**: Track processing times and success rates
- **Model Performance**: Monitor AI model accuracy
- **Usage Analytics**: Track API usage patterns
- **Error Monitoring**: Detailed error tracking and alerting

## Dependencies
- **FastAPI**: Web framework and file upload handling
- **SQLAlchemy**: Database session management
- **Pathlib**: Cross-platform file path handling
- **Shutil**: File operations
- **JSON**: Result parsing
- **AlertService**: Alert creation and management
- **ModelRunner**: AI model execution service