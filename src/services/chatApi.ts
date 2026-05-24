export const streamChat = async (
  message: string,
  sessionId: string,
  onChunk: (chunk: string) => void
) => {
  const API_URL = 'https://ulmind-ask-ai-backend.onrender.com';
  
  try {
    const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
};
