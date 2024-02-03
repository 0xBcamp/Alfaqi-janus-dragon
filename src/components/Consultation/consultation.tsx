import React, { useState } from 'react';
import Chat from './chat';
import LiveStream from './livestream';
import Prescription from './prescription';
import PatientRecords from './patientRecords';

// Mock data and functions
const messages = []; // Populate with real data
const sendMessage = (msg) => console.log(msg);
const stream = null; // Replace with actual stream data

const ConsultationPage = ({ userRole }) => {
  const [isLiveStreamEnabled, setIsLiveStreamEnabled] = useState(false);
  const [isDoctor, setIsDoctor] = useState(userRole === 'doctor');

  return (
    <div className="consultation-page">
      <Chat messages={messages} sendMessage={sendMessage} />
      <LiveStream isEnabled={isLiveStreamEnabled} stream={stream} />
      <Prescription isDoctor={userRole === 'doctor'} />
      {userRole === 'doctor' && <PatientRecords records={[]} />}
    </div>
  );
};
