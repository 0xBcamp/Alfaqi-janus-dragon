import React, { useEffect, useState } from "react";
import { Message, UserData } from "./app/mockData";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { createChatClient, newConversation, streamMessages, sendMessage as sendXmtpMessage } from './xmtp';
import { userAccountData } from "../../LoginPage";

let conversation = null;

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = useState<Message[]>(messages ?? []);

  useEffect(() => {
    async function setupXMTP() {
      await createChatClient();
      conversation = await newConversation(selectedUser.address);
      for await (const message of await streamMessages(conversation)) {
        setMessages(prevMessages => [...prevMessages, {
          id: prevMessages.length + 1, // Simplify for example purposes
          name: userAccountData.alias,
          message: message.content,
          senderAddress: message.senderAddress
        }]);
      }
    }

    if (selectedUser?.address) {
      setupXMTP();
    }
  }, [selectedUser]);

  const sendMessages = async (newMessage: string) => {
    // This needs to be adapted to use XMTP sendMessage
    if (!conversation) {
      console.log("No conversation selected");
      return;
    }
    const xmtpMessage = {
      id: Date.now(), // Simplify ID generation for example purposes
      name: userAccountData.alias, // Sender's chosen name
      message: newMessage,
      senderAddress: userAccountData.address, // Sender's address
    };
    await sendXmtpMessage(conversation, newMessage); // Adjust if necessary
    setMessages([...messagesState, xmtpMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
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
