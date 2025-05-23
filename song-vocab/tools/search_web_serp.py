from serpapi import GoogleSearch
from typing import List, Dict
import logging
import os

# Configure logging
logger = logging.getLogger(__name__)

async def search_web_serp(query: str, max_results: int = 5) -> List[Dict[str, str]]:
    """
    Search the web for Farsi song lyrics using SERP API.
    
    Args:
        query (str): Search query for the song lyrics
        max_results (int): Maximum number of search results to return
        
    Returns:
        List[Dict[str, str]]: List of search results with title and url
    """
    logger.info(f"Starting SERP API search for: {query}")
    
    # Add Farsi-specific keywords to improve results
    farsi_keywords = ["متن آهنگ", "lyrics", "فارسی"]
    enhanced_query = f"{query} {' '.join(farsi_keywords)}"
    logger.info(f"Enhanced query: {enhanced_query}")
    
    try:
        # Get API key from environment
        api_key = os.getenv('SERP_API_KEY')
        logger.debug(f"SERP_API_KEY found: {'yes' if api_key else 'no'}")
        if not api_key:
            logger.error("SERP_API_KEY environment variable not set")
            return []
        params = {
            "engine": "google",
            "q": enhanced_query,
            "num": max_results,
            "hl": "fa",  # Farsi language results
            "gl": "ir",  # Results from Iran
            "api_key": api_key
        }
        
        logger.debug(f"Sending request to SERP API with params: {params}")
        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            organic_results = results.get("organic_results", [])
            logger.debug(f"SERP API response: {results}")
        except Exception as e:
            logger.error(f"SERP API request failed: {e}", exc_info=True)
            return []
        
        if "error" in results:
            logger.error(f"SERP API error: {results['error']}")
            return []
        
        # Extract organic search results
        search_results = []
        if "organic_results" in results:
            for r in results["organic_results"][:max_results]:
                result = {
                    "title": r.get("title", ""),
                    "url": r.get("link", ""),
                    "snippet": r.get("snippet", "")
                }
                search_results.append(result)
                logger.debug(f"Found result: {result['title']} ({result['url']})")
        
        logger.info(f"Found {len(search_results)} results from SERP API")
        return search_results
        
    except Exception as e:
        logger.error(f"Error during SERP API search: {str(e)}", exc_info=True)
        return []