import React, { useState, useEffect } from 'react';

const Chat = ({ messages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <ul className="messages-list">
        {messages.map((msg, index) => (
          <li key={index}>{msg.author}: {msg.text}</li>
        ))}
      </ul>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;