
import { Livepeer } from "livepeer";
import { Player, Broadcast } from '@livepeer/react';

const livepeer = new Livepeer({
  apiKey: LIVEPEER_API, // API KEY
});
const streamName = 'Patient Alias - Doctor Name'; // TODO: implement this feature
let streamId = null; // streamId is setted when the stream is created
let streamKey = null; // streamKey is setted when the stream is created
let playbackId = null; // playbackId is setted when the stream is created - used for playing recorded streams // TODO: implement this feature

// Start the stream and return the stream object, which contains the streamId and streamKey
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

    // Set the streamId, streamKey and playbackId
    streamId = stream.id;
    streamKey = stream.streamKey;
    playbackId = stream.playbackId;

    console.log("Stream created:", stream);

    // Returns the stream object
    return stream;
    
  } catch (error) {
    console.error("Error starting stream:", error);
  }
};

// Play the stream
const playStream = () => {
  return (
    <Player
      title={streamName}
      playbackId={playbackId}
      showPipButton
      showTitle={false}
      aspectRatio="16to9"
      controls={{
        autohide: 3000,
      }}
      theme={{
        borderStyles: { containerBorderStyle: "hidden" },
        radii: { containerBorderRadius: "10px" },
      }}
    />
  );
};

// Terminate the stream
const terminateStream = async (streamId) => {
    try {
      const response = await fetch(`https://livepeer.studio/api/stream/${streamId}/terminate`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${LIVEPEER_API}`
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

// Retrieve the stream object
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

// Broadcast live video content directly from user’s web browser to online audiences in real-time
const broadcastStream = (streamName, streamKey) => {
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


export { startStream, playStream, terminateStream, retrieveStream, broadcastStream };