import { useState, useRef} from 'react';
import './MedicalChat.css';

function MedicalChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! 👋 I\'m your AI Medical Assistant. Ask me anything about medicines, symptoms, or general health information. Remember, I\'m here for information only - always consult a healthcare professional for medical advice!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
/*
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
  // Only auto-scroll if user is already near the bottom
  if (messagesEndRef.current) {
    const chatContainer = messagesEndRef.current.parentElement;
    const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
    
    if (isNearBottom) {
      scrollToBottom();
    }
  }
}, [messages]);*/

  const sendMessage = async () => {
  if (!inputText.trim()) return;

  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: inputText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  setMessages(prev => [...prev, userMessage]);
  setInputText('');
  setIsTyping(true);

  try {
    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3001/api/chat'
      : '/api/chat';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: inputText,
        context: `You are a helpful medical information assistant. 
        
IMPORTANT FORMATTING RULES:
- Keep responses SHORT and concise (3-5 sentences maximum for simple questions)
- Use bullet points for lists
- Break information into clear sections with line breaks
- Use simple, easy-to-understand language
- Avoid long paragraphs

Only answer health/medical related questions. If asked about non-medical topics, politely redirect to medical topics.
Always remind users to consult healthcare professionals for medical advice.`
      }),
    });

    const data = await response.json();

    if (data.success) {
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      throw new Error('Failed to get response');
    }
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Sorry, I encountered an error. Please try again!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What is paracetamol used for?",
    "Common cold remedies",
    "How to reduce fever?",
    "Side effects of aspirin"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <div className="medical-chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="bot-avatar">🤖</div>
          <div className="bot-info">
            <h3>Medical Assistant</h3>
            <span className="bot-status">● Online</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 1 && (
          <div className="quick-questions">
            <p className="quick-label">Quick questions:</p>
            {quickQuestions.map((q, idx) => (
              <button 
                key={idx} 
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
  <div 
    key={msg.id} 
    className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
  >
    {msg.sender === 'bot' && <div className="message-avatar">🤖</div>}
    <div className="message-content">
      <div className="message-bubble">
        {/* Format text with line breaks and bullet points */}
        {msg.text.split('\n').map((line, idx) => {
          // Check if line is a bullet point
          if (line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
            return (
              <div key={idx} className="bullet-point">
                • {line.trim().replace(/^[*\-•]\s*/, '')}
              </div>
            );
          }
          // Bold text (wrapped in **)
          else if (line.includes('**')) {
            const parts = line.split('**');
            return (
              <p key={idx}>
                {parts.map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </p>
            );
          }
          // Regular paragraph
          else if (line.trim()) {
            return <p key={idx}>{line}</p>;
          }
          // Empty line (spacing)
          return <br key={idx} />;
        })}
      </div>
      <div className="message-time">{msg.timestamp}</div>
    </div>
    {msg.sender === 'user' && <div className="message-avatar user-avatar">👤</div>}
  </div>
))}

        {isTyping && (
          <div className="message bot-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            placeholder="Ask about medicines, symptoms, or health..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          <button 
            className="send-button"
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicalChat;