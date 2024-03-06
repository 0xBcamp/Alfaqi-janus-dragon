import { CreateAccountInput } from '@moonup/moon-api';
import { MoonSDK } from '@moonup/moon-sdk';
import { MoonProvider } from '@moonup/ethers';
import { AUTH, MOON_SESSION_KEY, Storage, MoonConfig } from '@moonup/moon-types';
import { useState } from 'react';
import { useUserData } from '../Contexts/userDataContext';
import { ethers } from 'ethers';


const moonConfig: MoonConfig = {
	Storage: {
		key: MOON_SESSION_KEY,
		type: Storage.LOCAL,
	},
	Auth: {
		AuthType: AUTH.JWT,
	},
	Networks: [
		{
			chainId: '43113',
			chainName: 'Avalanche Fuji Testnet',
			nativeCurrency: {
				name: 'Avalanche',
				symbol: 'AVAX',
				decimals: 18,
			},
			rpcUrls: [process.env.NEXT_PUBLIC_AVAX_RPC_URL as string],
			blockExplorerUrls: ['https://testnet.snowtrace.io'],
		},
	],
};

const USER_KEY = useUserData().userData.alias;

export const useMoonSDK = () => {
	const [moon, setMoon] = useState<MoonSDK | null>(null);
	const [signer, setSigner] = useState<ethers.Signer | null>(null);
	const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
	const { userData } = useUserData();

	const initialize = async () => {
		const storedMoonSession = sessionStorage.getItem(USER_KEY);
		if (storedMoonSession) {
		  const sessionData = JSON.parse(storedMoonSession);
		  // sessionData contains necessary info to reinitialize MoonSDK instance
		  const moonInstance = new MoonSDK(sessionData.config);
		  setMoon(moonInstance);	  
		  moonInstance.connect();
			
			const providerInstance = new MoonProvider({
				chainId: 43113,
				MoonSDKConfig: moonConfig,
			});

			// Create a ethers provider from the moon provider
			const ethersProvider = new ethers.providers.Web3Provider(providerInstance.getSigner());
			setProvider(ethersProvider);
			
			// Create a signer from the ethers provider
			const ethersSigner = ethersProvider.getSigner();
			setSigner(ethersSigner);

		  return moonInstance;
		} else {
			const moonInstance = new MoonSDK(moonConfig);
			setMoon(moonInstance);
			(moonInstance as any).moonConfig = moonConfig;
			moonInstance.connect();
		
			const providerInstance = new MoonProvider({
			  chainId: 43113,
			  MoonSDKConfig: moonConfig,
			});
		
			const ethersProvider = new ethers.providers.Web3Provider(providerInstance.getSigner());
			setProvider(ethersProvider);
		
			const ethersSigner = ethersProvider.getSigner();
			setSigner(ethersSigner);
		
			return moonInstance;
		}
	};

	const connect = async () => {
		if (moon) {
		  const result = await moon.connect();
		  // Store moonConfig in sessionStorage for reinitialization
		  sessionStorage.setItem(USER_KEY, JSON.stringify({
			moonConfig: (moon as any).moonConfig,
		  }));
		  return result;
		}
	  };

	const updateToken = async (token: string, refreshToken: string) => {
		if (moon) {
			moon.updateToken(token);
			moon.updateRefreshToken(refreshToken);

			moon.connect();
		}
	};

	const createAccount = async () => {
		if (moon) {
			const data: CreateAccountInput = {};
			const newAccount = await moon?.getAccountsSDK().createAccount(data);
			if ('address' in newAccount?.data.data) {
				userData.address = newAccount?.data.data.address;
			}			
			return newAccount;
		}
	};

	const disconnect = async () => {
		if (moon) {
			await moon.disconnect();
			sessionStorage.removeItem(userData.alias);
			setMoon(null);
		  }
	};

	return {
		moon,
		signer,
		provider,
		initialize,
		connect,
		updateToken,
		createAccount,
		disconnect,
	};
};