import sys
import json
from pathlib import Path
import random

def run_inference(image_path: str, shelf_number: str = "A1"):
    """Mock AI detection for testing purposes"""
    
    # Create outputs directory
    outputs_dir = Path("static/outputs")
    outputs_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate mock detection results
    mock_items = ["Apple", "Banana", "Orange", "Milk", "Bread", "Cereal"]
    detected_items = random.sample(mock_items, random.randint(1, 4))
    empty_percentage = random.uniform(10, 60)
    
    output_data = {
        "shelf_number": shelf_number,
        "empty_percentage": round(empty_percentage, 2),
        "items_detected": detected_items,
        "mock_detection": True,
        "message": "This is a mock detection result for testing"
    }
    
    # Save results
    with open(outputs_dir / "output.json", "w") as f:
        json.dump(output_data, f, indent=4)
    
    print(f"Mock detection completed for {image_path}")
    print(f"Detected items: {detected_items}")
    print(f"Empty percentage: {empty_percentage:.2f}%")

if __name__ == "__main__":
    image_path = sys.argv[1]
    shelf_number = sys.argv[2] if len(sys.argv) > 2 else "A1"
    run_inference(image_path, shelf_number)