'use client';
import React, { useEffect, useState } from 'react';
import { Card, Title, Flex, Grid, Select, LineChart } from '@tremor/react';
import { useUserData } from '../userDataContext';
import { MoonProvider, MoonSigner } from '@moonup/ethers';
import { ethers } from 'ethers';
import { getDataFromIPFS } from '../ipfsHelia';
import { decryptData } from '../encryptData';
import appointmentContractABI from '../../../solidity/contracts/appointmentsContractABI.json'; 
import mainContractABI from '../../../solidity/contracts/mainContractABI.json';
import { newConversation } from "../Consultation/chat/xmtp";
import { useXMTP } from '../Consultation/chat/xmtpContext';

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const mainContractAddress = process.env.REACT_APP_MAIN_CONTRACT_ADDRESS;
  const appointmentContractAddress = process.env.REACT_APP_APPOINTMENT_CONTRACT_ADDRESS;
  const userData = useUserData();
  const { client, setConversation } = useXMTP();

  

  const provider = new MoonProvider({
    rpcUrl: 'https://rpc.moonup.com',
  });

  const signer = new MoonSigner({
    rpcUrl: 'https://rpc.moonup.com',
  });

  const mainContractProvider = new ethers.Contract(mainContractAddress, mainContractABI, provider);

  const appointmentContractProvider = new ethers.Contract(appointmentContractAddress, appointmentContractABI, provider);

  const appointmentContractSigner = new ethers.Contract(appointmentContractAddress, appointmentContractABI, signer);

  const personalData = {
    Name: mainContractProvider.getDoctorInfo(userData.address).name,
    Email: mainContractProvider.getDoctorInfo(userData.address).email,
    Specialty: mainContractProvider.getDoctorInfo(userData.address).specialty,
    Experience: mainContractProvider.getDoctorInfo(userData.address).timeExperience,
    Emergency: mainContractProvider.getDoctorInfo(userData.address).emergencyAppointment,
    Availability: mainContractProvider.getDoctorInfo(userData.address).availableTime
  };

  const personalDataEntries = Object.entries(personalData).map(([key, value]) => ({
    key,
    value,
  }));

  const activePatients = mainContractProvider.getActivePatients(); // Returns an array of active patient addresses
  const medicalRecords = mainContractProvider.getDoctorReportsHistory(); // Returns an array of IPFS hashes of medical reports

  useEffect(() => {
    const fetchAppointments = async () => {
      // Fetch confirmed appointments
      const confirmedIds = await appointmentContractProvider.getDoctorConfirmedAppointments();
      const confirmedData = await Promise.all(confirmedIds.map(id => appointmentContractProvider.appointments(id)));
      setConfirmedAppointments(confirmedData);

      // Fetch appointment requests
      const requestIds = await appointmentContractProvider.getDoctorRequestedAppointments();
      const requestData = await Promise.all(requestIds.map(id => appointmentContractProvider.appointments(id)));
      setAppointmentRequests(requestData);
    };

    fetchAppointments();

  }, [userData.address]);


  // Simulated function to get chart data for the selected patient
  // This should ideally come from your backend or data source
  const getChartDataForPatient = () => {
    // Your logic to return chart data
    // This is a placeholder function. Implement according to your data source
    return [
      // Example chart data
      { date: '2024-01-01', glucose: 100, cholesterol: 170 },
      { date: '2024-02-01', glucose: 110, cholesterol: 175 },
      // Add more data points as needed
    ];
  };

  const chartData = getChartDataForPatient();

  const data = [
    {
      category: 'Personal Info',
      data: personalDataEntries,
    },
    {
      category: 'Next Appointments',
      data: confirmedAppointments,
    },
    {
      category: 'Appointment Requests',
      data: appointmentRequests,
    },
    {
      category: 'Active Patients',
      data: activePatients,
    },
    {
      category: 'Medical Records',
      data: medicalRecords.map((record, index) => ({
        name: `Record ${index + 1}`,
        value: decryptData(getDataFromIPFS(record)),  
      })),
    },
  ];

  const handleAcceptRequest = async (requestId) => {
    try {
      await appointmentContractSigner.confirmAppointment(requestId);
      console.log('Appointment accepted successfully');
  
      if (!client) {
        console.error("XMTP client is not initialized");
        return;
      }
  
      // Start a new conversation with the patient's address and update context
      const conversation = await newConversation(client, requestId.patientAddress);
      console.log('New conversation started with:', requestId.patientAddress);
  
      // Pass the new conversation to update XMTP context
      setConversation(conversation);
  
    } catch (error) {
      console.error('Error accepting appointment or starting XMTP conversation:', error);
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
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="dashboard-header mb-8">
        <h1 className="text-2xl font-bold text-center text-color:#233044">Doctor Dashboard</h1>
        <hr className="my-4 border-white" />
      </div>
      <Grid className="grid-cols-2 gap-10">
        {data.map((item, index) => (
          <Card key={index} className={`p-4 ${item.category === 'Medical Records' ? 'col-span-2' : 'col-span-1'} bg-gray-800`}>
            <Title className="text-lg font-bold text-white">{item.category}</Title>
            <hr className="my-2 border-white" />
            <Flex flexDirection="column" gap="2" className="mt-4">
              {item.category === 'Medical Records' ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {item.data.map(async (record, index) => (
                    <React.Fragment key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="subtitle">{`Patient: ${record.value.patientAddress}`}</span>
                        <span className="subtitle text-right">{`Date: ${record.value.reportDate}`}</span>
                      </div>
                      <span className="text-base text-white">{await decryptData(getDataFromIPFS(record.value.ipfsHash))}</span>
                      {index < item.data.length - 1 && <hr className="my-2 border-gray-500" />}
                    </React.Fragment>
                  ))}
                </div>
              ) : item.category === 'Personal Info' ? (
                <div className="grid grid-cols-2 gap-4">
                  {item.data.map((info, index) => (
                    <span key={index} className="text-base text-white">{`${info.key}: ${info.value}`}</span>
                  ))}
                </div>
              ) : item.category === 'Appointment Requests' ? (
                <div>
                  {item.data.map((request, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span className="text-white">{request}</span>
                      <div>
                        <button className="bg-green-500 text-white px-2 py-1 rounded-lg ml-5 mr-5" onClick={() => handleAcceptRequest(request)}>
                          Accept
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded-lg mr-5" onClick={() => handleRejectRequest(request)}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                item.data.map((info, index) => (
                  <React.Fragment key={index}>
                    <span className="text-white">{info}</span>
                    {index < item.data.length - 1 && <hr className="my-2 border-gray-500" />}
                  </React.Fragment>
                ))
              )}
            </Flex>
          </Card>
        ))}
        <Card className="col-span-2 p-4 bg-gray-800">
          <Title className="text-lg font-bold text-white">Patient Health Overview</Title>
          <Select className="mt-4" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
            {Data.patients.map((patient, index) => (
              <option key={index} value={patient}>{patient}</option>
            ))}
          </Select>
          <LineChart
            className="h-72 mt-4"
            data={chartData}
            indexBy="date"
            keys={['glucose', 'cholesterol']}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            // Other necessary props for your chart configuration
          />
        </Card>
      </Grid>
    </main>
  );
}  
