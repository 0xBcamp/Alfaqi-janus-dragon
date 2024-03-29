import { CreateAccountInput } from '@moonup/moon-api';
import { MoonSDK } from '@moonup/moon-sdk';
import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
import { useState } from 'react';

export const useMoonSDK = () => {
	const [moon, setMoon] = useState<MoonSDK | null>(null);

	const initialize = async () => {
		const moonInstance = new MoonSDK({
			Storage: {
				key: MOON_SESSION_KEY,
				type: Storage.SESSION,
			},
			Auth: {
				AuthType: AUTH.JWT,
			},
		});
		setMoon(moonInstance);
		moonInstance.connect();
	};

	const connect = async () => {
		if (moon) {
			return moon.connect();
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
			return newAccount;
		}
	};

	const disconnect = async () => {
		if (moon) {
			await moon.disconnect();
			sessionStorage.removeItem(MOON_SESSION_KEY);
			setMoon(null);
		}
	};

	return {
		moon,
		initialize,
		connect,
		updateToken,
		createAccount,
		disconnect,
	};
};