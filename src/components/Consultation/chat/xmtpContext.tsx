import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useUserData } from "../../Contexts/userDataContext";
import { useMoonSDK } from "../../Moon/usemoonsdk";

const XMTPContext = createContext({
  client: null,
  conversation: null,
  conversationList: [],
  setConversation: (conversation: any | null) => {},
});

export const useXMTP = () => useContext(XMTPContext);

export const XMTPProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [conversationList, setConversationList] = useState([]);
  const { userData } = useUserData();
  const moonSDK = useMoonSDK();


  useEffect(() => {
    const initializeXMTP = async () => {
      if (!userData.address || !moonSDK.moon) return;

      // Ensure MoonSDK is initialized
      if (!moonSDK.moon) {
        await moonSDK.initialize();
      }

      // Retrives the signer
      const signer = moonSDK.signer;

      const xmtpClient = await Client.create(signer, { env: "dev" });
      setClient(xmtpClient);
    };

    initializeXMTP();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (client) {
        const conversations = await client.conversations.list();
        setConversationList(conversations);
      }
    };

    fetchConversations();
  }, [client, conversation]);

  const updateConversation = (newConversation: any | null) => {
    setConversation(newConversation);
  };

  const value = { client, conversation, conversationList, setConversation: updateConversation };

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>;
};