import os
import tempfile
from gtts import gTTS
import time
from typing import Dict, Optional
import requests
import json
import azure.cognitiveservices.speech as speechsdk

class AudioGenerator:
    def __init__(self):
        """Initialize the audio generator with temp directory"""
        print("Initializing AudioGenerator...")
        try:
            # Create temp directory for audio files if it doesn't exist
            self.temp_dir = os.path.join(tempfile.gettempdir(), 'dari_practice_audio')
            os.makedirs(self.temp_dir, exist_ok=True)
            print(f"Audio temp directory created at: {self.temp_dir}")
            
            # Set Azure credentials directly
            self.speech_key = "5JotSejPOZHmh1SMfuIKjN0T5I7PRAcvCAJr19zsz7onvUlp5Nl7JQQJ99BBACYeBjFXJ3w3AAAYACOGVaUd"
            self.service_region = "eastus"
            print(f"Using Azure Speech Service in region: {self.service_region}")
            
        except Exception as e:
            print(f"Error in initialization: {str(e)}")
            raise
    
    def generate_audio(self, question_data: Dict) -> Optional[str]:
        """Generate audio file for a question using TTS"""
        print("Generating audio for question...")
        temp_file = None
        
        try:
            # Get the conversation text
            conversation = question_data.get('Conversation', '')
            if not conversation:
                print("No conversation text found in question data")
                return None
            
            print(f"Conversation text to convert: {conversation}")
                
            # Clean up old files
            self._cleanup_old_files()
            
            # Generate a unique filename
            timestamp = int(time.time())
            output_file = os.path.join(self.temp_dir, f'audio_{timestamp}.mp3')
            print(f"Will save audio to: {output_file}")
            
            # Try Azure TTS
            try:
                success = self._try_azure_tts(conversation, output_file)
                if success:
                    return output_file
            except Exception as e:
                print(f"Azure TTS failed with error: {str(e)}")
                return None
            
        except Exception as e:
            print(f"Error in generate_audio: {str(e)}")
            return None
    
    def _try_azure_tts(self, text: str, output_file: str) -> bool:
        """Try generating audio using Azure TTS"""
        print("Trying Azure TTS...")
        try:
            # Configure speech config
            speech_config = speechsdk.SpeechConfig(
                subscription=self.speech_key, 
                region=self.service_region
            )
            
            # Set output format
            speech_config.set_speech_synthesis_output_format(
                speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
            )
            
            # Configure audio output to file
            audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)
            
            # Create synthesizer with Persian voice
            speech_config.speech_synthesis_voice_name = "fa-IR-DilaraNeural"
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speech_config, 
                audio_config=audio_config
            )
            
            # Create SSML with Persian text
            ssml = f"""
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="fa-IR">
                <voice name="fa-IR-DilaraNeural">
                    <prosody rate="0.9" pitch="0%">
                        {text}
                    </prosody>
                </voice>
            </speak>
            """
            
            # Generate audio
            print("Generating audio with Azure TTS...")
            result = synthesizer.speak_ssml_async(ssml).get()
            
            # Check result
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                if os.path.exists(output_file):
                    size = os.path.getsize(output_file)
                    print(f"Azure TTS successful, file size: {size} bytes")
                    if size > 1000:
                        return True
                    else:
                        print("Generated file too small, likely invalid")
                        return False
                else:
                    print("Output file not created")
                    return False
            else:
                print(f"Azure TTS failed: {result.reason}")
                if hasattr(result, 'cancellation_details'):
                    print(f"Cancellation reason: {result.cancellation_details.reason}")
                    print(f"Error details: {result.cancellation_details.error_details}")
                return False
                
        except Exception as e:
            print(f"Error with Azure TTS: {str(e)}")
            return False
    
    def _cleanup_old_files(self):
        """Clean up old audio files to prevent disk space issues"""
        try:
            current_time = time.time()
            for filename in os.listdir(self.temp_dir):
                filepath = os.path.join(self.temp_dir, filename)
                # Remove files older than 1 hour
                if os.path.getctime(filepath) < current_time - 3600:
                    try:
                        os.remove(filepath)
                        print(f"Cleaned up old file: {filename}")
                    except:
                        pass
        except Exception as e:
            print(f"Error in cleanup: {str(e)}")
    
    def __del__(self):
        """Cleanup on object destruction"""
        try:
            self._cleanup_old_files()
        except:
            pass
