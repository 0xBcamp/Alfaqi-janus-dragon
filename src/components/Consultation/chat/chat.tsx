import React, { useEffect, useState } from "react";
import { Message } from "./app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { newConversation, sendMessage, streamMessages } from "./xmtp";
import { useXMTP } from './xmtpContext';
import { useUserData } from '../../userDataContext';

export function Chat({ messages, selectedUser, isMobile }) {
  const [messagesState, setMessages] = useState<Message[]>(messages ?? []);
  const xmtpClient = useXMTP();
  const { userData } = useUserData();
  let conversation = null;

  useEffect(() => {
    let unsubscribe = () => {}; // Function to stop listening to new messages

    const setupXMTP = async () => {
      if (!selectedUser?.address || !xmtpClient) return;

      // Assuming `newConversation` is correctly implemented in your XMTP setup
      conversation = await newConversation(xmtpClient, selectedUser.address);
      // Store the current conversation in a ref or state if you plan to use it outside this useEffect
      // conversation = conv;

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
  }, [selectedUser, xmtpClient, userData.alias]);

  const sendMessages = async (newMessageContent) => {
    if (!conversation || !xmtpClient) return;

    // Send message
    await sendMessage(conversation, newMessageContent); // Make sure this matches your actual API

    // Update local state with new message
    const newMessage = {
      id: Date.now(), // Again, consider a more reliable method for IDs
      name: userData.alias,
      message: newMessageContent,
      senderAddress: userData.address, // Verify this matches your expected structure
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
