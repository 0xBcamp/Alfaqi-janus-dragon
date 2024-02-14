import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useUserData } from "../../userDataContext";
import { MoonSigner } from '@moonup/ethers';

// Update the context type definition
const XMTPContext = createContext({
  client: null,
  conversation: null,
  setConversation: (conversation: any | null) => {},
});

export const useXMTP = () => useContext(XMTPContext);

export const XMTPProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const { userData } = useUserData();

  useEffect(() => {
    const initializeXMTP = async () => {
      if (!userData.address) return;
      const signer = new MoonSigner({
        rpcUrl: 'https://rpc.moonup.com',
      });
      const xmtpClient = await Client.create(signer, { env: "dev" });
      setClient(xmtpClient);
    };

    initializeXMTP();
  }, [userData.address]);

  const updateConversation = (newConversation: any | null) => {
    setConversation(newConversation);
  };

  const value = { client, conversation, setConversation: updateConversation };

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>;
};