import React from 'react';

const LiveStream = ({ isEnabled, stream }) => {
  return (
    <div>
      {isEnabled ? (
        <video autoPlay playsInline muted ref={video => {
          if (video) {
            video.srcObject = stream;
          }
        }} />
      ) : (
        <p>Live stream is currently disabled.</p>
      )}
    </div>
  );
};

export default LiveStream;