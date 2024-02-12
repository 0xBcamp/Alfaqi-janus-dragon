import React from 'react';
import { ethers } from 'ethers';
import { MoonSigner } from '@moonup/ethers';

const appointmentContractABI = appointmentContractABI; // Your contract ABI
const appointmentContractAddress = "APPOINTMENT_CONTRACT_ADDRESS";

const appointmentContractSigner = new ethers.Contract(appointmentContractAddress, appointmentContractABI, new MoonSigner({
  rpcUrl: 'https://rpc.moonup.com',
}));

const handleAcceptRequest = async (requestId) => {
  try {
    // Assuming acceptAppointment is a contract function to accept an appointment request
    await appointmentContractSigner.confirmAppointment(requestId);
    console.log('Appointment accepted successfully');
    // Optionally, remove the accepted request from the UI or refetch the requests
  } catch (error) {
    console.error('Error accepting appointment:', error);
  }
};

const handleRejectRequest = async (requestId) => {
  try {
    await appointmentContractSigner.rejectAppointment(requestId);
    console.log('Appointment rejected successfully');
    // Optionally, remove the rejected request from the UI or refetch the requests
  } catch (error) {
    console.error('Error rejecting appointment:', error);
  }
};

  return (
    <div className="p-4">
      <ul>
        {requests.map((request, index) => (
          <li key={index} className="mt-2">
            <div>
              <p>Request for {request.patientName} consultation</p>
              <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
              <button className="bg-red-500 text-white p-2 ml-2 rounded-lg" onClick={() => handleRejectRequest(request.id)}>Decline</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentRequests;
