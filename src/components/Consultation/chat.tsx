import { Client } from "@xmtp/xmtp-js";
import {
  ContentTypeAttachment,
  AttachmentCodec,
  RemoteAttachmentCodec,
  ContentTypeRemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import { addDataToIPFS } from "../ipfsHelia";
import { MoonSigner } from "@moonup/ethers";

// Create a new chat client at the XTMP network
async function createChatClient() {
  const xmtp = await Client.create(MoonSigner.address, {env: "dev"}); // TODO: properly acess the address
  console.log(xmtp)
  console.log("Client created",xmtp.address);
  return xmtp;
}

// Check if an address is on the network
// First you need to check if the address you want to message is on the XMTP network. You can do this by calling client.canMessage with the address you want to message.
// Message this XMTP message bot to get an immediate automated reply:
// gm.xmtp.eth (0x937C0d4a6294cdfa575de17382c7076b579DC176) env:production
async function canMessage(receiverAddress) {
  const isOnProdNetwork = await xmtp.canMessage(receiverAddress);
  console.log("Can message: " + isOnProdNetwork);
  return isOnProdNetwork;
}

// Start a new conversation
// You can create a new conversation with any EVM address activated on the XMTP network
async function newConversation(receiverAddress) {
  const conversation = await xmtp.conversations.newConversation(receiverAddress);
  console.log("Conversation created", newConversation);
  return conversation;
}

// Send a message
// To send a message, the recipient must have already started their client at least once and consequently advertised their key bundle on the network.
async function sendMessage(conversation, usermessage) {
  const message = await conversation.prepareMessage(usermessage);
  try {
    message.send();
    console.log("Message sent", message);
    return message;
  } catch 
  
}

// Stream messages in a conversation
// You can receive the complete message history in a conversation.
async function streamMessages(conversation) {
  for await (const message of await conversation.streamMessages()) {
  console.log(`New message from ${message.senderAddress}: ${message.content}`);
  return message;
  }
}

// Create remote attachment
// image is the uploaded event.target.files[0];
async function createRemoteAttachment(image) {
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Not an ArrayBuffer"));
      }
    };
    reader.readAsArrayBuffer(image);
  });
  
  // Create an attachment object:
  const attachment = {
    filename: image?.name,
    mimeType: image?.type,
    data: new Uint8Array(data),
  }; 
  
  // Use RemoteAttachmentCodec.encodeEncrypted to encrypt an attachment:
  const encryptedEncoded = await RemoteAttachmentCodec.encodeEncrypted(
    attachment,
    new AttachmentCodec(),
  );

  // Upload the attachment to IPFS and then sets the url to the base url plus the CID that is returned by the addDataToIPFS
  const cid = await addDataToIPFS(encryptedEncoded);
  const baseUrl = "https://ipfs.io/ipfs/";
  const url = baseUrl + cid;

  // Create a RemoteAttachment:
  const remoteAttachment = {
    url: url,
    contentDigest: encryptedEncoded.digest,
    salt: encryptedEncoded.salt,
    nonce: encryptedEncoded.nonce,
    secret: encryptedEncoded.secret,
    scheme: "https://",
    filename: attachment.filename,
    contentLength: attachment.data.byteLength,
  };

  return remoteAttachment;
}

// Send remote attachment
async function sendAttachment (conversation, remoteAttachment) {
  await conversation.send(remoteAttachment, {
  contentType: ContentTypeRemoteAttachment,
  });
};

// Receive attachment - TODO: properly implement this
async function receiveAttachment (message) {
  if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    const attachment = await RemoteAttachmentCodec.load(message.content, client);
  }
}