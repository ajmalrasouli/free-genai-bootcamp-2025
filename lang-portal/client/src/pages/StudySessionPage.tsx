import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';

export function StudySessionPage() {
  const [, params] = useRoute('/study/flashcards/:groupId');
  const [, setLocation] = useLocation();
  const groupId = params?.groupId;

  useEffect(() => {
    // Redirect to FlashcardsPage
    if (groupId) {
      setLocation(`/study/flashcards/${groupId}`);
    } else {
      // If no group ID is provided, redirect to study page
      setLocation('/study');
    }
  }, [groupId, setLocation]);

  return null;
} 