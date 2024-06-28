import React, { useEffect, useRef, useState } from 'react';
import './style.css';

interface Props {
  onClose: () => void;
  username: string;
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

const ChatWindow: React.FC<Props> = ({ onClose, username }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'admin',
      text: '무엇을 도와드릴까요?',
      timestamp: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        sender: username,
        text: input,
        timestamp: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // 관리자 응답 추가
      setTimeout(() => {
        const adminMessage: Message = {
          sender: 'admin',
          text: '관리자의 응답입니다.',
          timestamp: new Date().toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prevMessages) => [...prevMessages, adminMessage]);
      }, 1000); // 1초 후에 응답
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        관리자와 대화하기
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender === username ? 'user' : 'admin'}`}>
            <div className="message-content">
              <span className="message-sender">{message.sender === username ? `[${message.sender}]` : '[관리자]'}</span>
              <span className="message-text">{message.text}</span>
              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
