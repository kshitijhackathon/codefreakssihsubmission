import { useState, useEffect } from 'react';

export default function HospitalChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize conversation on component mount
  useEffect(() => {
    if (!isInitialized) {
      const firstPrompt = "Hello! I'm your health assistant. May I know your name?";
      setMessages([{ bot: firstPrompt }]);
      setIsInitialized(true);
      speakText(firstPrompt);
    }
  }, [isInitialized]);

  // Language detection for TTS
  function detectLanguage(text) {
    if (text.split('').some(c => "\u0900" <= c && c <= "\u097F")) { // Devanagari
      return "hi";
    } else if (text.split('').some(c => "\u0A00" <= c && c <= "\u0A7F")) { // Gurmukhi
      return "pa";
    } else {
      return "en";
    }
  }

  // Text-to-speech function
  function speakText(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = detectLanguage(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  // Voice input function
  async function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; // Default to Hindi, can be made dynamic

    setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  async function handleSend() {
    const trimmed = (input || '').trim();
    if (!trimmed || isSending) return;
    setIsSending(true);

    const historyToSend = messages;
    const userMessage = { user: trimmed };
    setMessages([...messages, userMessage]);

    try {
      // Quick info handlers from earlier code (bed availability, visiting hours, medicines)
      const lower = trimmed.toLowerCase();
      if (/(^|\b)bed(s)?\b/.test(lower)) {
        try {
          const res = await fetch('/api/hospital-info');
          if (res.ok) {
            const data = await res.json();
            const bedText = Array.isArray(data?.beds)
              ? `Available beds:\n${data.beds.map(b => `${b.hospital}: ${b.available}`).join(', ')}`
              : 'Bed availability information is currently unavailable.';
            setMessages(prev => [...prev, { bot: bedText }]);
            speakText(bedText);
          }
        } catch {}
      } else if (/(visiting\s*hour|visiting\s*hours)/.test(lower)) {
        try {
          const res = await fetch('/api/hospital-info');
          if (res.ok) {
            const data = await res.json();
            const hourText = data?.visitingHours ? `Hospital visiting hours are ${data.visitingHours}.` : 'Visiting hours are currently unavailable.';
            setMessages(prev => [...prev, { bot: hourText }]);
            speakText(hourText);
          }
        } catch {}
      } else if (/(medicine|available\s*medicine|medicines)/.test(lower)) {
        try {
          const res = await fetch('/api/medicine');
          if (res.ok) {
            const meds = await res.json();
            const medsText = Array.isArray(meds)
              ? `Available medicines:\n${meds.map(m => `${m.name} (${m.stock})`).join(', ')}`
              : 'Medicine information is currently unavailable.';
            setMessages(prev => [...prev, { bot: medsText }]);
            speakText(medsText);
          }
        } catch {}
      }

      const res = await fetch('/api/health-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: historyToSend })
      });
      const data = await res.json();
      const reply = data?.reply || "I'm unable to respond right now. Please try again.";
      setMessages(prev => [...prev, { bot: reply }]);
      speakText(reply);
    } catch (e) {
      setMessages(prev => [...prev, { bot: 'There was a problem connecting to the assistant. Please try again.' }]);
    } finally {
      setIsSending(false);
      setInput('');
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#f5faff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '100%',
        maxWidth: 700,
        height: '95vh',
        background: '#fff',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        border: 'none'
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: 16, textAlign: 'center' }}>🏥 Healthcare Assistant</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 16, fontSize: '0.9rem' }}>
          I can speak English, Hindi, and Punjabi. ⚠️ For emergencies, seek professional help immediately.
        </p>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#f5faff',
          borderRadius: 12,
          border: 'none',
          padding: 16,
          marginBottom: 16
        }}>
          {messages.map((msg, i) =>
            msg.user ? (
              <div key={i} style={{ textAlign: 'right', margin: '8px 0' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#1976d2',
                  color: '#fff',
                  borderRadius: 16,
                  padding: '8px 16px',
                  fontWeight: 500
                }}>{msg.user}</span>
              </div>
            ) : (
              <div key={i} style={{ textAlign: 'left', margin: '8px 0' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#e3f2fd',
                  color: '#0d47a1',
                  borderRadius: 16,
                  padding: '8px 16px',
                  whiteSpace: 'pre-line',
                  fontWeight: 500
                }}>{msg.bot}</span>
              </div>
            )
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            onClick={startVoiceInput}
            disabled={isListening || isSending}
            style={{
              background: isListening ? '#ff9800' : '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 16px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: isListening || isSending ? 'not-allowed' : 'pointer',
              opacity: isListening || isSending ? 0.7 : 1
            }}
          >
            {isListening ? '🎤 Listening...' : '🎤 Voice'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message or use voice input..."
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 6,
              border: '2px solid #1976d2',
              fontSize: '1rem',
              outline: 'none'
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            style={{
              background: isSending ? '#ccc' : '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0 24px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: isSending ? 'not-allowed' : 'pointer'
            }}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
