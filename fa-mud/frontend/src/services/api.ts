interface GameState {
  theme: string;
  current_room: string;
  inventory: string[];
  history: string[];
}

interface MessageResponse {
  session_id: string;
  message: string;
  game_state?: GameState;
}

const API_URL = 'http://localhost:8000/api';

export const gameService = {
  async newGame(theme: string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/game/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    });
    return response.json();
  },

  async sendMessage(message: string, sessionId?: string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/game/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId })
    });
    return response.json();
  },

  async loadGame(sessionId: string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/game/load/${sessionId}`);
    return response.json();
  }
}; 