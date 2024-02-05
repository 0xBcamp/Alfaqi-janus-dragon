'use client';
import React, { useState } from 'react';
import { Card, Title, Flex, Grid, Select, LineChart } from '@tremor/react';

export default function DoctorDashboard() {
  const mockData = {
    personalInfo: {
      Name: "Dr. Jane Doe",
      Email: "jane.doe@example.com",
      Specialty: "Cardiology"
    },
    appointments: ['Dora appointment details...', 'Frederick appointment details...'],
    requests: ['John', 'Alfred'],
    patients: ['Vitalik Buterin', 'Charles Hoskinson', 'Satoshi Nakamoto'],
    medicalRecords: [
      { patientName: 'Vitalik Buterin', date: '2024-01-01', time: '9:00 am', report: 'Record 1 details...' },
      { patientName: 'Charles Hoskinson', date: '2024-01-02', time: '10:00 am', report: 'Record 2 details...' }
    ],
    // Assuming this data structure for the LineChart (to be implemented)
  };

  const [selectedPatient, setSelectedPatient] = useState(mockData.patients[0]);

  // Simulated function to get chart data for the selected patient
  // This should ideally come from your backend or data source
  const getChartDataForPatient = (patientName) => {
    // Your logic to return chart data
    // This is a placeholder function. Implement according to your data source
    return [
      // Example chart data
      { date: '2024-01-01', glucose: 100, cholesterol: 170 },
      { date: '2024-02-01', glucose: 110, cholesterol: 175 },
      // Add more data points as needed
    ];
  };

  const chartData = getChartDataForPatient(selectedPatient);

  const personalInfo = Object.entries(mockData.personalInfo).map(([key, value]) => ({
    key,
    value,
  }));

  // Corrected mapping for medical records
  const data = [
    {
      category: 'Personal Info',
      data: personalInfo
    },
    {
      category: 'Next Appointments',
      data: mockData.appointments,
    },
    {
      category: 'Appointment Requests',
      data: mockData.requests,
    },
    {
      category: 'Active Patients',
      data: mockData.patients,
    },
    {
      category: 'Medical Records',
      data: mockData.medicalRecords.map((record, index) => ({
        name: `Record ${index + 1}`,
        value: record,
      })),
    },
  ];

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
                  {item.data.map((record, index) => (
                    <React.Fragment key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="subtitle">{`Patient: ${record.value.patientName}`}</span>
                        <span className="subtitle text-right">{`Date: ${record.value.date}, ${record.value.time}`}</span>
                      </div>
                      <span className="text-base text-white">{record.value.report}</span>
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
            {mockData.patients.map((patient, index) => (
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
