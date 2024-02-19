import React, { useState } from 'react';
import { Card, Title, Flex, Text, Button } from '@tremor/react';
import InputBase from '@mui/material/InputBase';

// Doctor type definition remains the same
type Doctor = {
  id: string; //address
  name: string;
  email: string;
  specialty: string;
  experience: string;
  avaliability: string;
  emergency: boolean;
};

interface DoctorCardProps {
  doctor: Doctor;
  onRequestAppointment: (doctor: Doctor, timestamp: string, reason: string) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onRequestAppointment }) => {
  const [timestamp, setTimestamp] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (timestamp && reason) {
      onRequestAppointment(doctor, timestamp, reason);
    } else {
      alert("Both timestamp and reason are required!");
    }
  };

  return (
    <div key={doctor.id} className="space-y-2">
    <Card className="p-4 bg-gray-800 text-white rounded-lg">
      <Title className="text-lg font-bold">{doctor.name}</Title>
        <Text className="text-base">Specialty: {doctor.specialty}</Text>
        <Text className="text-base">Experience time: {doctor.experience}</Text>
        <Text className="text-base">Available Times: {doctor.avaliability}</Text>
        {doctor.emergency && <Text className="text-red-500">Accepts Emergency Consultations</Text>}
      <InputBase
          placeholder="Appointment Timestamp"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          fullWidth
          style={{ color: '#fff', marginBottom: '10px' }}
      />
      <InputBase
          placeholder="Reason for Appointment"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          style={{ color: '#fff' }}
      />
      <Button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
      Request Appointment
      </Button>
    </Card>
  </div>
  );
};

interface DoctorsListProps {
  doctors: Doctor[];
  onRequestAppointment: (doctor: Doctor, timestamp: string, reason: string) => void;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors, onRequestAppointment }) => {
  return (
    <div className="space-y-4">
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onRequestAppointment={onRequestAppointment} />
        ))
      ) : (
        <Text className="text-white">No doctors available matching your criteria.</Text>
      )}
    </div>
  );
};

export default DoctorsList;
