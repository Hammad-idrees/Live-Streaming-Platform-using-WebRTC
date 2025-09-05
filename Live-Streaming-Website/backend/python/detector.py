# backend/python/detector.py
import cv2
import numpy as np
from ultralytics import YOLO
import sys
import json
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_image(image_path):
    try:
        logger.info(f"🔍 Analyzing image: {image_path}")
        
        # Check if image exists
        if not os.path.exists(image_path):
            logger.error(f"❌ Image file not found: {image_path}")
            return []
        
        # Check image file size
        file_size = os.path.getsize(image_path)
        logger.info(f"📊 Image file size: {file_size} bytes")
        
        if file_size == 0:
            logger.error("❌ Image file is empty")
            return []
        
        # Load image to verify it's valid
        img = cv2.imread(image_path)
        if img is None:
            logger.error("❌ Failed to load image with OpenCV")
            return []
        
        logger.info(f"📏 Image dimensions: {img.shape}")
        
        # Load YOLO model (download if not exists)
        logger.info("🤖 Loading YOLO model...")
        model = YOLO('yolov8n.pt')  # This will download if not present
        
        # Run inference with error handling
        logger.info("🔍 Running object detection...")
        results = model(image_path, imgsz=320, conf=0.3, verbose=False)
        
        # Extract detected objects
        detected_objects = set()
        total_detections = 0
        
        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    class_id = int(box.cls.item())
                    confidence = float(box.conf.item())
                    class_name = result.names[class_id]
                    
                    # Only include high-confidence detections
                    if confidence > 0.3:
                        detected_objects.add(class_name)
                        total_detections += 1
                        logger.info(f"✅ Detected: {class_name} (confidence: {confidence:.2f})")
        
        unique_objects = list(detected_objects)
        logger.info(f"🎯 Final results: {len(unique_objects)} unique objects from {total_detections} total detections")
        logger.info(f"📋 Objects: {unique_objects}")
        
        return unique_objects
        
    except Exception as e:
        logger.error(f"💥 Error in analyze_image: {str(e)}")
        import traceback
        logger.error(f"📚 Full traceback: {traceback.format_exc()}")
        return []

if __name__ == "__main__":
    if len(sys.argv) != 2:
        logger.error("❌ Usage: python detector.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    logger.info(f"🚀 Starting analysis of: {image_path}")
    
    results = analyze_image(image_path)
    
    # Output results as JSON
    print(json.dumps(results))
    logger.info(f"✅ Analysis complete. Returned {len(results)} objects.")
