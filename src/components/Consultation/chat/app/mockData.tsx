import { userAccountData } from "../../../LoginPage";

// New UserData structure to fit XMTP and application requirements
export interface UserData {
    role: string; // User role, e.g. "patient" or "doctor"
    name: string; // User chosen name
    address: string; // User's wallet address
}

export interface Message {
    id: number; // Unique message ID
    name: string; // Sender name, chosen by the sender
    message: string; // Message content
    senderAddress: string; // To identify the sender, use the XMTP address
}

// Example user data, assuming you manage to fetch or set this elsewhere in your app
export const usersData: UserData[] = [
    { role: 'patient', name: 'Jane Doe', address: '0xJaneDoeAddress' },
    { role: 'doctor', name: 'John Doe', address: '0xJohnDoeAddress' },
    // Add more users as needed
];

// loggedInUserData should include the address now
export const loggedInUserData: UserData = {
    role: userAccountData.role, // User role, e.g. "patient" or "doctor"
    name: 'Alias', // This can be set by the user in your application
    address: userAccountData.address, // User's wallet address
};