import React, { useState } from 'react';
import { Card, Title, Text, Button } from '@tremor/react';
import InputBase from '@mui/material/InputBase';
import { ethers } from 'ethers';
import { useMoonSDK } from '../Moon/usemoonsdk';
import { useAuth } from '../Contexts/authContext';
import appointmentContractABI from '../../../solidity/contracts/appointmentsContractABI.json';

// Doctor type definition remains the same
type Doctor = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: string;
  availability: string;
  emergency: boolean;
};

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [timestamp, setTimestamp] = useState('');
  const [reason, setReason] = useState('');
  const moonSDK = useMoonSDK();
  const isAuthenticated = useAuth().isAuthenticated;

  const handleSubmit = async () => {
    // Check if moonSDK is initialized
    if (!moonSDK && !isAuthenticated) {
      console.error('You are not properly authenticated. Please login to request an appointment.');
      return;
    }

    try {
      if (!timestamp || !reason) {
        console.error("Timestamp and reason for the appointment must be provided.");
        return;
      }

      const appointmentContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_APPOINTMENT_CONTRACT_ADDRESS,
        appointmentContractABI,
        moonSDK.signer
      );
        
      const tx = await appointmentContract.requestAppointment(doctor.id, timestamp, reason);
      await tx.wait();

      window.alert('Appointment requested successfully.');
    } catch (error) {
      console.error("Error requesting appointment:", error);
    }
  }
 
  return (
    <div key={doctor.id} className="space-y-2">
      <Card className="p-4 bg-gray-800 text-white rounded-lg">
        <Title className="text-lg font-bold">{doctor.name}</Title>
        <Text className="text-base">Specialty: {doctor.specialty}</Text>
        <Text className="text-base">Experience: {doctor.experience} years</Text>
        <Text className="text-base">Availability: {doctor.availability}</Text>
        {doctor.emergency && <Text className="text-red-500">Accepts Emergency Consultations</Text>}
        <InputBase
          placeholder="Appointment Timestamp (YYYY-MM-DD HH:MM)"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          fullWidth
          style={{ color: 'black', marginBottom: '10px' }}
        />
        <InputBase
          placeholder="Reason for Appointment"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          style={{ color: 'black' }}
        />
        <Button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleSubmit()}
        >
          Request Appointment
        </Button>
      </Card>
    </div>
  );
};

interface DoctorsListProps {
  doctors: Doctor[];
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors }) => {
  return (
    <div className="space-y-4">
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))
      ) : (
        <Text className="text-white">No doctors available matching your criteria.</Text>
      )}
    </div>
  );
};

export default DoctorsList;