// Removed: /// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }
}

// API base URL - Use environment variable
// Default to localhost for standalone development, but Docker build will override
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8003/api';

// Mock data for Persian/Dari vocabulary
const mockData = {
  words: [
    // Numbers (groupId: 1)
    {
      id: 1,
      dariWord: 'یک',
      pronunciation: 'yak',
      englishTranslation: 'One',
      exampleSentence: 'من یک کتاب دارم',
      groupId: 1
    },
    {
      id: 2,
      dariWord: 'دو',
      pronunciation: 'do',
      englishTranslation: 'Two',
      exampleSentence: 'دو نفر آمدند',
      groupId: 1
    },
    {
      id: 3,
      dariWord: 'سه',
      pronunciation: 'se',
      englishTranslation: 'Three',
      exampleSentence: 'سه ساعت گذشت',
      groupId: 1
    },
    {
      id: 4,
      dariWord: 'چهار',
      pronunciation: 'chahār',
      englishTranslation: 'Four',
      exampleSentence: 'چهار روز باقی مانده',
      groupId: 1
    },
    {
      id: 5,
      dariWord: 'پنج',
      pronunciation: 'panj',
      englishTranslation: 'Five',
      exampleSentence: 'پنج دقیقه صبر کن',
      groupId: 1
    },
    // Family Members (groupId: 2)
    {
      id: 6,
      dariWord: 'پدر',
      pronunciation: 'padar',
      englishTranslation: 'Father',
      exampleSentence: 'پدر من دکتر است',
      groupId: 2
    },
    {
      id: 7,
      dariWord: 'مادر',
      pronunciation: 'mādar',
      englishTranslation: 'Mother',
      exampleSentence: 'مادر من معلم است',
      groupId: 2
    },
    {
      id: 8,
      dariWord: 'برادر',
      pronunciation: 'barādar',
      englishTranslation: 'Brother',
      exampleSentence: 'برادر من در دانشگاه درس می‌خواند',
      groupId: 2
    },
    {
      id: 9,
      dariWord: 'خواهر',
      pronunciation: 'khāhar',
      englishTranslation: 'Sister',
      exampleSentence: 'خواهر من مهندس است',
      groupId: 2
    },
    // Basic Phrases (groupId: 3)
    {
      id: 10,
      dariWord: 'سلام',
      pronunciation: 'salām',
      englishTranslation: 'Hello',
      exampleSentence: 'سلام، حال شما چطور است؟',
      groupId: 3
    },
    {
      id: 11,
      dariWord: 'خداحافظ',
      pronunciation: 'khudā hāfiz',
      englishTranslation: 'Goodbye',
      exampleSentence: 'خداحافظ، فردا می‌بینمت',
      groupId: 3
    },
    {
      id: 12,
      dariWord: 'تشکر',
      pronunciation: 'tashakor',
      englishTranslation: 'Thank you',
      exampleSentence: 'تشکر از کمک شما',
      groupId: 3
    },
    // Common Phrases (groupId: 4)
    {
      id: 13,
      dariWord: 'چطور هستی',
      pronunciation: 'chetor hasti',
      englishTranslation: 'How are you',
      exampleSentence: 'سلام، چطور هستی؟',
      groupId: 4
    },
    {
      id: 14,
      dariWord: 'اسم من است',
      pronunciation: 'esm-e man ast',
      englishTranslation: 'My name is',
      exampleSentence: 'اسم من علی است',
      groupId: 4
    }
  ],
  wordGroups: [
    {
      id: 1,
      name: "Numbers",
      description: "Basic numbers in Dari"
    },
    {
      id: 2,
      name: "Family Members",
      description: "Family-related vocabulary"
    },
    {
      id: 3,
      name: "Basic Phrases",
      description: "Common everyday phrases"
    },
    {
      id: 4,
      name: "Common Phrases",
      description: "Additional useful phrases"
    }
  ],
  studySessions: [
    {
      id: 1,
      groupId: 1,
      groupName: "Numbers",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      score: 85,
      correctCount: 8,
      incorrectCount: 2,
      createdAt: new Date().toISOString()
    }
  ]
};

// Helper function to format endpoints
function formatEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

// Use mock data for development, but attempt real API call first
export async function fetchJson<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${formatEndpoint(endpoint)}`;
  console.log(`Fetching from: ${url}`);
  
  try {
    // Try the real API first
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log(`Response from ${url}:`, data);
      return data;
    }
    
    throw new Error('API request failed or returned non-JSON');
  } catch (error) {
    console.error(`API request error: ${error}`);
    throw error;
  }
}

export async function postJson<T>(endpoint: string, data?: any): Promise<T> {
  const url = `${API_BASE}${formatEndpoint(endpoint)}`;
  console.log(`Posting to: ${url}`, data);
  
  try {
    // Try the real API first
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const responseData = await response.json();
      console.log(`Response from ${url}:`, responseData);
      return responseData;
    }
    
    throw new Error('API POST request failed');
  } catch (error) {
    console.error(`API POST request error: ${error}`);
    throw error;
  }
}

export async function patchJson<T>(endpoint: string, data?: any): Promise<T> {
  const url = `${API_BASE}${formatEndpoint(endpoint)}`;
  console.log(`Patching to: ${url}`, data);
  
  try {
    const response = await fetch(url, {
      method: 'PATCH', // Use PATCH method
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const responseData = await response.json();
      console.log(`Response from PATCH ${url}:`, responseData);
      return responseData;
    }
    
    // Improved error handling
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API PATCH request failed with status ${response.status}: ${errorText}`);
        throw new Error(`API PATCH request failed: ${response.status} - ${errorText}`);
    }
    
    throw new Error('API PATCH request failed or returned non-JSON');
  } catch (error) {
    console.error(`API PATCH request error: ${error}`);
    throw error;
  }
}