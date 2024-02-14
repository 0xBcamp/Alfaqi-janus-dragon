import React, { useEffect, useState } from "react";
import { Message } from "./app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { sendMessage, streamMessages } from "./xmtp";
import { useXMTP } from './xmtpContext';
import { useUserData } from '../../userDataContext';

export function Chat({ messages, selectedUser, isMobile }) {
  const [messagesState, setMessages] = useState<Message[]>(messages ?? []);
  const { conversation } = useXMTP();
  const { userData } = useUserData();

  useEffect(() => {
    let unsubscribe = () => {}; // Function to stop listening to new messages

    const setupXMTP = async () => {
      if (!selectedUser?.address) return;
      const stream = async () => {
        for await (const message of await streamMessages(conversation)) {
          setMessages((prevMessages) => [...prevMessages, {
            id: Date.now(), // Consider using a more reliable method for unique IDs
            name: selectedUser.alias,
            message: message.content,
            senderAddress: message.senderAddress,
          }]);
        }
      };

      stream();
      
      // Define cleanup function to stop the message stream
      unsubscribe = () => {
        // Implement stopping the stream if XMTP provides a method for it
      };
    };

    setupXMTP();

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [selectedUser, userData.alias]);

  const sendMessages = async (newMessageContent) => {
    if (!conversation) return;

    // Send message
    await sendMessage(conversation, newMessageContent); // Make sure this matches your actual API

    // Update local state with new message
    const newMessage = {
      id: Date.now(),
      name: userData.alias,
      message: newMessageContent,
      senderAddress: userData.address,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="bg-white flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessages}
        isMobile={isMobile}
      />
    </div>
  );
}
