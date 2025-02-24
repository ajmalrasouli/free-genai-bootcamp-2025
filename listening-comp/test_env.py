import os
from dotenv import load_dotenv
import sys

def test_env_variables():
    # Load environment variables from .env
    load_dotenv()
    
    # Variables to check
    required_vars = {
        'AZURE_SPEECH_KEY': os.getenv('AZURE_SPEECH_KEY'),
        'AZURE_SPEECH_REGION': os.getenv('AZURE_SPEECH_REGION'),
        'DEBUG': os.getenv('DEBUG')
    }
    
    # Optional AWS variables
    aws_vars = {
        'AWS_REGION': os.getenv('AWS_REGION'),
        'AWS_ACCESS_KEY_ID': os.getenv('AWS_ACCESS_KEY_ID'),
        'AWS_SECRET_ACCESS_KEY': os.getenv('AWS_SECRET_ACCESS_KEY')
    }
    
    print("\n=== Environment Variables Test ===\n")
    
    # Check required variables
    all_required_present = True
    print("Required Variables:")
    for var_name, value in required_vars.items():
        if value:
            # For sensitive values, only show first/last few characters
            if 'KEY' in var_name and value:
                masked_value = f"{value[:4]}...{value[-4:]}"
                print(f"✅ {var_name} = {masked_value}")
            else:
                print(f"✅ {var_name} = {value}")
        else:
            print(f"❌ {var_name} is not set")
            all_required_present = False
    
    # Check AWS variables
    print("\nAWS Variables (Optional):")
    for var_name, value in aws_vars.items():
        if value:
            masked_value = "***" if 'KEY' in var_name else value
            print(f"✅ {var_name} = {masked_value}")
        else:
            print(f"ℹ️ {var_name} is not set")
    
    # Final status
    print("\nStatus:", end=" ")
    if all_required_present:
        print("✅ All required environment variables are set correctly")
        return True
    else:
        print("❌ Some required environment variables are missing")
        return False

if __name__ == "__main__":
    success = test_env_variables()
    sys.exit(0 if success else 1)
