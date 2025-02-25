import os
import json
from typing import Dict, List, Optional
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
import re

class TranscriptDownloader:
    def __init__(self, data_dir: str = "backend/data/transcripts"):
        """Initialize the TranscriptDownloader.
        
        Args:
            data_dir (str): Directory to store downloaded transcripts
        """
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
    
    def extract_video_id(self, url: str) -> Optional[str]:
        """Extract YouTube video ID from URL.
        
        Args:
            url (str): YouTube video URL
            
        Returns:
            str: Video ID if found, None otherwise
        """
        try:
            # Try using pytube first
            return YouTube(url).video_id
        except:
            # Fallback to regex pattern matching
            patterns = [
                r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
                r'youtu\.be\/([0-9A-Za-z_-]{11})',
                r'youtube\.com\/embed\/([0-9A-Za-z_-]{11})'
            ]
            
            for pattern in patterns:
                match = re.search(pattern, url)
                if match:
                    return match.group(1)
            return None

    def get_video_info(self, url: str) -> Dict:
        """Get video title and other metadata.
        
        Args:
            url (str): YouTube video URL
            
        Returns:
            Dict: Video metadata including title, author, etc.
        """
        try:
            # Add debugging
            print(f"Getting video info for URL: {url}")
            
            # Initialize YouTube
            yt = YouTube(url)
            
            # Use innertube client to get video info
            try:
                # Force prefetch
                yt.streams.first()
                
                # Get video details
                info = {
                    'title': yt.title if yt.title else "Unknown Title",
                    'author': yt.author if yt.author else "Unknown Author",
                    'length': yt.length if yt.length else 0,
                    'views': yt.views if hasattr(yt, 'views') else 0,
                    'publish_date': str(yt.publish_date) if yt.publish_date else "Unknown",
                    'video_id': yt.video_id if yt.video_id else self.extract_video_id(url)
                }
                
                print(f"Successfully retrieved video info: {info}")
                return info
                
            except Exception as e:
                print(f"Error getting video details: {str(e)}")
                # Try alternate method using initial data
                if hasattr(yt, 'initial_data'):
                    video_details = yt.initial_data.get('videoDetails', {})
                    info = {
                        'title': video_details.get('title', "Unknown Title"),
                        'author': video_details.get('author', "Unknown Author"),
                        'length': int(video_details.get('lengthSeconds', 0)),
                        'views': int(video_details.get('viewCount', 0)),
                        'publish_date': "Unknown",
                        'video_id': video_details.get('videoId', self.extract_video_id(url))
                    }
                    print(f"Retrieved video info from initial data: {info}")
                    return info
                raise
            
        except Exception as e:
            print(f"Error in get_video_info: {str(e)}")
            # Fallback to minimal info
            video_id = self.extract_video_id(url)
            if video_id:
                return {
                    'title': 'Unknown Title',
                    'author': 'Unknown Author',
                    'length': 0,
                    'views': 0,
                    'publish_date': 'Unknown',
                    'video_id': video_id
                }
            raise Exception(f"Failed to get video information: {str(e)}")

    def download_transcript(self, url: str, languages: List[str] = ['fa', 'en']) -> Dict:
        """Download transcript for a YouTube video.
        
        Args:
            url (str): YouTube video URL
            languages (List[str]): List of language codes to try, in order of preference
            
        Returns:
            Dict: Dictionary containing transcript data and metadata
        """
        try:
            video_id = self.extract_video_id(url)
            if not video_id:
                return {'error': 'Invalid YouTube URL'}

            # Get video info
            video_info = self.get_video_info(url)
            if not video_info:
                return {'error': 'Failed to get video information'}

            # Get transcript
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try each language in order
            transcript = None
            language_found = None
            
            for lang in languages:
                try:
                    transcript = transcript_list.find_transcript([lang])
                    language_found = lang
                    break
                except:
                    continue
            
            if not transcript:
                return {'error': 'No transcript found in specified languages'}

            # Get transcript data
            transcript_data = transcript.fetch()
            
            # Save transcript
            output_file = os.path.join(self.data_dir, f"{video_id}.json")
            data = {
                'video_info': video_info,
                'transcript': transcript_data,
                'language': language_found
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            return data
            
        except Exception as e:
            return {'error': str(e)}

    def get_transcript_stats(self, transcript_data: List[Dict]) -> Dict:
        """Calculate statistics for a transcript.
        
        Args:
            transcript_data (List[Dict]): List of transcript segments
            
        Returns:
            Dict: Statistics about the transcript
        """
        if not transcript_data:
            return {}
            
        total_duration = sum(segment.get('duration', 0) for segment in transcript_data)
        total_words = sum(len(segment.get('text', '').split()) for segment in transcript_data)
        segment_count = len(transcript_data)
        
        avg_segment_duration = total_duration / segment_count if segment_count > 0 else 0
        avg_words_per_segment = total_words / segment_count if segment_count > 0 else 0
        
        return {
            'total_duration': round(total_duration, 2),
            'total_duration_minutes': round(total_duration / 60, 2),
            'total_segments': segment_count,
            'total_words': total_words,
            'average_segment_duration': round(avg_segment_duration, 2),
            'average_words_per_segment': round(avg_words_per_segment, 2)
        }