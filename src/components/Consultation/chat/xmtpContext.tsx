import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useUserData } from "../../userDataContext";
import { MoonSigner } from '@moonup/ethers';

const XMTPContext = createContext(null);

export const useXMTP = () => useContext(XMTPContext);

export const XMTPProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const { userData } = useUserData();

  useEffect(() => {
    const initializeXMTP = async () => {
      if (!userData.address) return;
      // Initialize XMTP client with appropriate signer
      const signer = new MoonSigner({
        rpcUrl: 'https://rpc.moonup.com',
      });
      const xmtpClient = await Client.create(signer, { env: "dev" });
      setClient(xmtpClient);
    };

    initializeXMTP();
  }, [userData.address]);

  return <XMTPContext.Provider value={client}>{children}</XMTPContext.Provider>;
};
