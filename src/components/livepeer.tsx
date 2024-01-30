
import { Livepeer } from "livepeer";
import { Broadcast } from '@livepeer/react';
import { addDataToIPFS, getDataFromIPFS } from "./ipfsHelia";
import { encryptData, decryptData} from "./encryptData";

const livepeer = new Livepeer({
  apiKey: LIVEPEER_API, // API KEY
});
const streamName = 'Patient Alias - Doctor Name';
const crypto = require('crypto');
let streamId = null;
let streamKey = null;
let livestreamToken = {};

const startStream = async (isRecording) => { // isRecording is a boolean value that is only true when the doctor and patient give consent to record the session
  const streamData = {
    name: streamName,
    record: isRecording,
    profiles: [
      {
        name: "720p",
        bitrate: 2000000,
        fps: 30,
        width: 1280,
        height: 720,
      },
      {
        name: "480p",
        bitrate: 1000000,
        fps: 30,
        width: 854,
        height: 480,
      },
      {
        name: "360p",
        bitrate: 500000,
        fps: 30,
        width: 640,
        height: 360,
      },
    ],
  };

  try {
    const stream = await livepeer.stream.create(streamData);

    // Set the streamId and streamKey
    streamId = stream.id;
    streamKey = stream.streamKey;

    console.log("Stream created:", stream);

    // Returns the stream object
    return stream;
    
  } catch (error) {
    console.error("Error starting stream:", error);
  }
};

const terminateStream = async (streamId) => {
    try {
      const response = await fetch(`https://livepeer.studio/api/stream/${streamId}/terminate`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log("Stream terminated successfully");
    } catch (error) {
      console.error("Error terminating stream:", error);
    }
  };

const retrieveStream = async (streamId) => {
    (async () => {
        try {
          const res = await livepeer.stream.get(streamId);
          // Handle the response (res.data)
        } catch (error) {
          console.error(error);
        }
      })();
    };

const broadcastStream = () => {
        return (
          <Broadcast
            title={streamName}
            streamKey={streamKey}
            controls={{
              autohide: 3000,
              
            }}
            theme={{
                borderStyles: {
                  containerBorderStyle: "hidden",
                },
                colors: {
                  accent: "#00a55f",
                },
                space: {
                  controlsBottomMarginX: "10px",
                  controlsBottomMarginY: "5px",
                  controlsTopMarginX: "15px",
                  controlsTopMarginY: "10px",
                },
                radii: {
                  containerBorderRadius: "0px",
                },
              }}
            />
          );
        }

const generateAccessToken = (userAddress, streamId) => { // userAddress and streamId are associated with the token generated
    const token = crypto.randomBytes(16).toString('hex');

    return {token, userAddress, streamId};
};

const storeToken = async (token, userAddress, streamId) => {
    const cid = await addDataToIPFS(token); // Store encrypted token on IPFS and get CID so it can be retrieved by the other party
  
    // Store the CID in a in the Patient Data with the streamId - probably will need to add a new array to the Patient Data
    livestreamToken[userAddress] = { streamId, cid };
    addPatientData(userAddress, livestreamToken[userAddress]); // This need to be implemented on the Smart Contract and adjusted

    return {cid, streamId};
  };

const retrieveToken = async (userAddress) => { // Returns the decrypted token and streamId associated with it
    const {cid, streamId} = livestreamToken[userAddress];
    const token = await getDataFromIPFS(cid);

    return {token, streamId};
}


export { startStream, terminateStream, retrieveStream, broadcastStream, generateAccessToken, storeToken, retrieveToken };