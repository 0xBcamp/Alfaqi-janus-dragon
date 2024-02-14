import { Message, UserData } from "./app/data";
import { cn } from "./lib/utils";
import React, { useRef, useState, useEffect } from "react";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { useXMTP } from "./xmtpContext";
import { fetchConversations } from "./xmtp";

interface ChatListProps {
  messages?: Message[];
  selectedUser: UserData;
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
}

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const xmtpClient = useXMTP();

  useEffect(() => {
    const loadConversations = async () => {
      if (!xmtpClient) return;
      const conversations = await fetchConversations(xmtpClient);
      setConversations(conversations);
    };

    loadConversations();
  }, [xmtpClient]);

  return (
    <div>
      {conversations.map((conversation, index) => (
        <div key={index}>
          {/* Display conversation details here */}
          Conversation with {conversation.peerAddress}
        </div>
      ))}
    </div>
  );
};

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  isMobile
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.senderAddress !== userData.address ? "items-start" : "items-end"
              )}
            >
              <span className="bg-primary p-3 rounded-md max-w-xs">
                {message.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar sendMessage={sendMessage} selectedUserAddress={selectedUser.address} isMobile={isMobile}/>
    </div>
  );
}