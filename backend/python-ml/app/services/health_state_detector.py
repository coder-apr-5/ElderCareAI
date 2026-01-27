import cv2
import numpy as np
import mediapipe as mp
import base64
from datetime import datetime
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class HealthStateDetector:
    def __init__(self):
        self.pose = mp.solutions.pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.5
        )
        self.face_detection = mp.solutions.face_detection.FaceDetection(
            min_detection_confidence=0.5
        )
        self.state_history = {}  # User ID → state timeline
        
        # Thresholds
        self.SUDDEN_CHANGE_THRESHOLD = 2.0  # seconds
        self.OVERSLEEP_THRESHOLD = 3 * 60 * 60  # 3 hours
        self.NORMAL_NAP_DURATION = 45 * 60  # 45 minutes
        
    async def analyze_health_state(
        self,
        user_id: str,
        image_base64: str,
        timestamp: datetime
    ) -> Dict:
        """
        Analyze if user is sleeping normally, fainting, or in distress
        """
        # Decode image
        image = self._decode_image(image_base64)
        if image is None:
             return self._get_empty_result()
        
        # Extract features
        pose_result = self._detect_pose(image)
        face_result = self._detect_face(image)
        
        if not pose_result['detected']:
             return self._get_empty_result()

        movement = self._analyze_movement(user_id, pose_result, timestamp)
        
        # Get user history
        history = self.state_history.get(user_id, [])
        
        # Determine state
        state_result = self._classify_state(
            pose=pose_result,
            face=face_result,
            movement=movement,
            history=history,
            timestamp=timestamp
        )
        
        # Update history
        self._update_history(user_id, {
            'timestamp': timestamp,
            'body_angle': pose_result['body_angle'],
            'state': state_result['state']
        }, timestamp)
        
        # Check for alerts
        alert = self._check_alert_conditions(user_id, state_result, history)
        
        return {
            **state_result,
            'alert_level': alert['level'],
            'recommendation': alert['recommendation']
        }
    
    def _decode_image(self, image_base64: str) -> Optional[np.ndarray]:
        try:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            nparr = np.frombuffer(base64.b64decode(image_base64), np.uint8)
            return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            logger.error(f"Image decode error: {e}")
            return None

    def _detect_pose(self, image: np.ndarray) -> Dict:
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image_rgb)
        
        if not results.pose_landmarks:
            return {'detected': False, 'body_angle': 90, 'head_angle': 0}
            
        landmarks = results.pose_landmarks.landmark
        
        # Calculate body angle (vertical = 90, horizontal = 0)
        # Using shoulders and hips
        left_shoulder = landmarks[11]
        right_shoulder = landmarks[12]
        left_hip = landmarks[23]
        right_hip = landmarks[24]
        
        mid_shoulder = np.array([(left_shoulder.x + right_shoulder.x)/2, (left_shoulder.y + right_shoulder.y)/2])
        mid_hip = np.array([(left_hip.x + right_hip.x)/2, (left_hip.y + right_hip.y)/2])
        
        # Vector from hip to shoulder
        vector = mid_shoulder - mid_hip
        
        # Angle with vertical (y-axis is inverted in images, so down is positive)
        # We want angle relative to horizontal ground? or vertical stance?
        # Let's say 90 is standing (vertical), 0 is lying down (horizontal)
        
        dx, dy = vector[0], vector[1] # dy is negative if standing
        angle_rad = np.arctan2(abs(dy), abs(dx))
        angle_deg = np.degrees(angle_rad)
        
        # If standing, dx is small, dy is large -> angle near 90
        # If lying, dx is large, dy is small -> angle near 0
        
        return {
            'detected': True,
            'body_angle': angle_deg,
            'head_angle': 0 # Simplified
        }

    def _detect_face(self, image: np.ndarray) -> Dict:
         image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
         results = self.face_detection.process(image_rgb)
         return {'detected': bool(results.detections)}

    def _analyze_movement(self, user_id: str, pose: Dict, timestamp: datetime) -> Dict:
        # In a real system, compare landmarks with previous frame for speed
        # Here we simulate or calculate if possible
        return {'speed': 0, 'suddenness': 0}

    def _classify_state(
        self,
        pose: Dict,
        face: Dict,
        movement: Dict,
        history: List,
        timestamp: datetime
    ) -> Dict:
        """
        Core classification logic
        """
        body_angle = pose['body_angle']
        movement_suddenness = movement['suddenness']
        
        # Time context
        hour = timestamp.hour
        is_nap_time = (13 <= hour <= 16) or (hour >= 22 or hour <= 6)
        
        # RULE 1: Detect FAINTING (CRITICAL)
        if self._is_fainting(body_angle, movement_suddenness, history, timestamp):
            return {
                'state': 'fainting',
                'confidence': 0.92,
                'details': {
                    'posture': 'collapsed',
                    'movement_suddenness': movement_suddenness,
                    'body_angle': body_angle,
                    'alert': 'IMMEDIATE EMERGENCY'
                }
            }
        
        # RULE 2: Detect NORMAL SLEEP
        # Reclined (< 45 deg)
        if body_angle < 45:
             sleep_duration = self._calculate_sleep_duration(history, timestamp)
             
             # Check for OVERSLEEP on chair/couch? (Can't detect furniture easily without ObjDet)
             # Assumption: If angle < 45 and not moving for long time
             if sleep_duration > self.OVERSLEEP_THRESHOLD:
                 return {
                    'state': 'oversleep',
                    'confidence': 0.88,
                    'details': {
                        'posture': 'sleeping_long',
                        'duration_seconds': sleep_duration,
                        'concern': 'Uncomfortable position for extended period'
                    }
                }
             
             return {
                'state': 'normal_sleep',
                'confidence': 0.90,
                'details': {
                    'posture': 'sleeping',
                    'duration_seconds': sleep_duration,
                    'location': 'reclined'
                }
            }
            
        # RULE 3: Resting
        if 45 <= body_angle < 75:
             return {
                'state': 'resting',
                'confidence': 0.85,
                'details': {
                    'posture': 'sitting_relaxed'
                }
            }
            
        # RULE 4: Active
        return {
            'state': 'active',
            'confidence': 0.80,
            'details': {
                'posture': 'upright'
            }
        }

    def _is_fainting(self, body_angle: float, movement_suddenness: float, history: List, current_time: datetime) -> bool:
        if not history:
            return False
            
        prev_state = history[-1]
        prev_angle = prev_state.get('body_angle', 90)
        
        # If angle dropped significantly and suddenly
        if prev_angle > 60 and body_angle < 30:
             # Check time diff
             time_diff = (current_time - prev_state['timestamp']).total_seconds()
             if time_diff < self.SUDDEN_CHANGE_THRESHOLD:
                 return True
                 
        return False

    def _calculate_sleep_duration(self, history: List, current_time: datetime) -> int:
        if not history:
            return 0
        
        sleep_start = None
        for i in range(len(history) - 1, -1, -1):
            if history[i].get('state') not in ['normal_sleep', 'resting', 'oversleep']:
                break
            sleep_start = history[i]['timestamp']
            
        if sleep_start:
            return int((current_time - sleep_start).total_seconds())
        return 0

    def _update_history(self, user_id: str, state_data: Dict, timestamp: datetime):
        if user_id not in self.state_history:
            self.state_history[user_id] = []
        
        self.state_history[user_id].append(state_data)
        
        # Keep only last 24 hours or limited history
        if len(self.state_history[user_id]) > 1000:
             self.state_history[user_id].pop(0)

    def _check_alert_conditions(self, user_id: str, state_result: Dict, history: List) -> Dict:
        state = state_result.get('state')
        
        if state == 'fainting':
            return {
                'level': 'emergency',
                'recommendation': '🚨 CALL EMERGENCY SERVICES IMMEDIATELY! Possible fainting or medical emergency detected.'
            }
        
        if state == 'oversleep':
            return {
                'level': 'warning',
                'recommendation': '⚠️ Elder has been sleeping in uncomfortable position for over 3 hours. Check on them.'
            }
            
        return {'level': 'none', 'recommendation': None}

    def _get_empty_result(self):
        return {
            'state': 'unknown', 'confidence': 0, 
            'alert_level': 'none', 'recommendation': None, 
            'details': {}
        }

health_state_detector = HealthStateDetector()
