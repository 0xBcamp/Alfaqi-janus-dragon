// UserData structure to fit XMTP and application requirements
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