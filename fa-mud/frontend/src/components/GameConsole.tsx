import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import CommandInput from './CommandInput';
import GameOutput from './GameOutput';

interface GameConsoleProps {
  theme?: string;
}

export const GameConsole: React.FC<GameConsoleProps> = ({ theme = 'default' }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setLoading(true);
    try {
      const response = await gameService.newGame(theme);
      setSessionId(response.session_id);
      setMessages([response.message]);
    } catch (error) {
      setMessages(['Error starting game']);
    }
    setLoading(false);
  };

  const handleCommand = async (command: string) => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const response = await gameService.sendMessage(command, sessionId);
      setMessages(prev => [...prev, `> ${command}`, response.message]);
    } catch (error) {
      setMessages(prev => [...prev, 'Error processing command']);
    }
    setLoading(false);
  };

  return (
    <div className="game-console">
      <GameOutput messages={messages} />
      <CommandInput onSubmit={handleCommand} disabled={loading} />
    </div>
  );
}; 