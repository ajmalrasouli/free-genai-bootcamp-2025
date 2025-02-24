"""AWS Configuration"""
import os
import boto3
from botocore.config import Config

# AWS Configuration
AWS_CONFIG = {
    'region_name': os.getenv('AWS_REGION', 'us-east-1'),
    'aws_access_key_id': os.getenv('AWS_ACCESS_KEY_ID'),
    'aws_secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY')
}

# Azure Speech Service credentials
os.environ["AZURE_SPEECH_KEY"] = os.getenv('AZURE_SPEECH_KEY')
os.environ["AZURE_SPEECH_REGION"] = os.getenv('AZURE_SPEECH_REGION', 'eastus')

# App settings
APP_NAME = "Persian Learning Assistant"
APP_VERSION = "1.0.0"
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Audio settings
AUDIO_TEMP_DIR = "temp/audio"
AUDIO_CLEANUP_AGE = 3600  # Clean up audio files older than 1 hour

# Question generation settings
MAX_RETRIES = 3
TIMEOUT = 30

def init_aws_client(service_name):
    """Initialize AWS client with configuration"""
    config = Config(
        region_name=AWS_CONFIG['region_name'],
        retries=dict(max_attempts=MAX_RETRIES)
    )
    
    return boto3.client(
        service_name,
        aws_access_key_id=AWS_CONFIG['aws_access_key_id'],
        aws_secret_access_key=AWS_CONFIG['aws_secret_access_key'],
        config=config
    )
