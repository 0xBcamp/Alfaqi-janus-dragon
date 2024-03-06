import { Livepeer } from "livepeer";
import { Player, Broadcast } from '@livepeer/react';

interface StreamProfile {
  bitrate: number;
  encoder: string;
  fps: number;
  fpsDen: number;
  gop: string;
  height: number;
  name: string;
  profile: string;
  quality: number;
  width: number;
}

interface StreamPlaybackPolicy {
  refreshInterval: number;
  type: string;
  webhookContext: object;
  webhookId: string;
}

interface Stream {
  createdAt: number;
  createdByTokenName: string;
  creatorId: {
    type: string;
    value: string;
  };
  id: string;
  ingestRate: number;
  isActive: boolean;
  isHealthy: boolean;
  isTrovoAuth: boolean;
  issues: string[];
  lastSeen: number;
  multistream: {
    targets: Array<{
      id: string;
      profile: string;
    }>;
  };
  name: string;
  outgoingRate: number;
  parentId: string;
  playbackId: string;
  playbackPolicy: StreamPlaybackPolicy;
  profiles: StreamProfile[];
  record: boolean;
  sourceBytes: number;
  sourceSegments: number;
  sourceSegmentsDuration: number;
  streamKey: string;
  suspended: boolean;
  transcodedBytes: number;
  transcodedSegments: number;
  transcodedSegmentsDuration: number;
  userTags: object;
}


function mapCreateStreamResponseToStream(response: any): Stream {
  const streamInfo = response[0];

  const stream: Stream = {
    createdAt: streamInfo.createdAt,
    createdByTokenName: streamInfo.createdByTokenName,
    creatorId: streamInfo.creatorId.value, // Assuming creatorId is an object with type and value
    id: streamInfo.id,
    isActive: streamInfo.isActive,
    isHealthy: streamInfo.isHealthy,
    name: streamInfo.name,
    playbackId: streamInfo.playbackId,
    streamKey: streamInfo.streamKey,
    profiles: streamInfo.profiles.map((profile: any) => ({
      bitrate: profile.bitrate,
      encoder: profile.encoder,
      fps: profile.fps,
      height: profile.height,
      name: profile.name,
      profile: profile.profile,
      width: profile.width,
    })),
    ingestRate: streamInfo.ingestRate,
    isTrovoAuth: streamInfo.isTrovoAuth,
    issues: streamInfo.issues,
    lastSeen: streamInfo.lastSeen,
    multistream: {
      targets: streamInfo.multistream.targets.map((target: any) => ({
        id: target.id,
        profile: target.profile,
      })),
    },
    outgoingRate: streamInfo.outgoingRate,
    parentId: streamInfo.parentId,
    playbackPolicy: {
      refreshInterval: streamInfo.playbackPolicy.refreshInterval,
      type: streamInfo.playbackPolicy.type,
      webhookContext: streamInfo.playbackPolicy.webhookContext,
      webhookId: streamInfo.playbackPolicy.webhookId,
    },
    record: streamInfo.record,
    sourceBytes: streamInfo.sourceBytes,
    sourceSegments: streamInfo.sourceSegments,
    sourceSegmentsDuration: streamInfo.sourceSegmentsDuration,
    suspended: streamInfo.suspended,
    transcodedBytes: streamInfo.transcodedBytes,
    transcodedSegments: streamInfo.transcodedSegments,
    transcodedSegmentsDuration: streamInfo.transcodedSegmentsDuration,
    userTags: streamInfo.userTags,
  };

  return stream;
}


const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API
});
let streamId = null; // streamId is setted when the stream is created
let streamKey = null; // streamKey is setted when the stream is created
let playbackId = null; // playbackId is setted when the stream is created - used for playing recorded streams

// Start the stream and return the streamId, streamKey and playbackId
async function startStream(streamName: string, isRecording: boolean): Promise<Stream> {
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
    const response = await livepeer.stream.create(streamData);

    if (!response || typeof response !== 'object') {
      throw new Error("Stream creation failed or returned an unexpected response");
    }

    // Assuming response is of type StreamResponse and needs to be mapped to Stream
    const stream: Stream = mapCreateStreamResponseToStream(response);

    // Set the streamId, streamKey, and playbackId
    streamId = stream.id;
    streamKey = stream.streamKey;
    playbackId = stream.playbackId;

    console.log("Stream created:", stream);

    // Return the stream object
    return stream;
    
  } catch (error) {
    console.error("Error starting stream:", error);
    throw new Error("Failed to start stream");
  }
}

// Play the stream
function playStream (streamName, playbackId) {
  return (
    <Player
      title={streamName}
      playbackId={playbackId}
      showPipButton={true}
      showTitle={false}
      aspectRatio="16to9"
      controls={{
        autohide: 3000,
      }}
      theme={{
        borderStyles: { containerBorderStyle: "solid" },
        radii: { containerBorderRadius: "10px" },
      }}
    />
  );
};

// Terminate the stream
async function terminateStream (streamId) {
    const LIVEPEER_API = process.env.LIVEPEER_API;
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
async function retrieveStream (streamId) {
    (async () => {
        try {
          const res = await livepeer.stream.get(streamId);
          return res;

        } catch (error) {
          console.error(error);
        }
      })();
    };

// Broadcast live video content directly from user’s web browser to online audiences in real-time
function broadcastStream (streamName, streamKey) {
        return (
          <Broadcast
            title={streamName}
            streamKey={streamKey}
            controls={{
              autohide: 3000,
              
            }}
            theme={{
                borderStyles: {
                  containerBorderStyle: "solid",
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