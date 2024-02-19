import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useUserData } from "../../userDataContext";
import { MoonSigner } from '@moonup/ethers';
import { useMoonSDK } from "../../usemoonsdk";
import { MoonSDK } from '@moonup/ethers/node_modules/@moonup/moon-sdk/';
import { ethers } from 'ethers';

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
  const moonSDKHook = useMoonSDK();


  useEffect(() => {
    const initializeXMTP = async () => {
      if (!userData.address || !moonSDKHook.moon) return;

      // Ensure MoonSDK is initialized
      if (!moonSDKHook.moon) {
        await moonSDKHook.initialize();
      }

      const avalancheFujiTestnetRPC = "https://avalanche-fuji-c-chain.publicnode.com";
      const provider = new ethers.providers.JsonRpcProvider(avalancheFujiTestnetRPC);
      const signerAddress = await provider.getSigner().getAddress();
      const chainId = (await provider.getNetwork()).chainId.toString();

      // Now we use the moon instance directly from moonSDKHook
      const signer = new MoonSigner({
        SDK: moonSDKHook.moon as unknown as MoonSDK,
        address: signerAddress,
        chainId,
      });

      const xmtpClient = await Client.create(signer, { env: "dev" });
      setClient(xmtpClient);
    };

    initializeXMTP();
  }, []);

  const updateConversation = (newConversation: any | null) => {
    setConversation(newConversation);
  };

  const value = { client, conversation, setConversation: updateConversation };

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>;
};