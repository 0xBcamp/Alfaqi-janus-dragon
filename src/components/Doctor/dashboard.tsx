import React from 'react';
import { Card, Title, Flex, Grid } from '@tremor/react';
import MedicalRecords from './../Patient/medicalRecords';
import NextAppointments from './nextAppointments';
import AppointmentRequests from './appointmentRequests';
import ActivePatients from './activePatients';
import PersonalData from './personalData';

export default function DoctorDashboard () {
  const mockData = {
    personalInfo: {
      name: "Dr. Jane Doe",
      email: "jane.doe@example.com",
      specialty: "Cardiology"
    },
    appointments: ['Dora appointment details...', 'Frederick appointment details...'],
    requests: ['John', 'Alfred'],
    patients: ['Vitalik Buterin', 'Charles Hoskinson', 'Satoshi Nakamoto'],
    medicalRecords: ['Record 1 details...', 'Record 2 details...'],
  };

  // Function to render items with separators
  const renderItemsWithSeparators = (items) => (
    items.map((item, index) => (
      <React.Fragment key={index}>
        <div className="text-base text-white">{item}</div>
        {index < items.length - 1 && <hr className="my-2 border-white" />} {/* Separator */}
      </React.Fragment>
    ))
  );

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="dashboard-header mb-8">
        <h1 className="text-2xl font-bold text-center">Doctor Dashboard</h1>
      </div>
      <Grid className="grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info Card */}
        <Card className="p-4 bg-gray-800 text-white col-span-1">
          <Title className="text-lg font-bold">Personal Info</Title>
          <Flex flexDirection="column" gap="2" className="mt-4">
            {renderItemsWithSeparators([
              `Name: ${mockData.personalInfo.name}`,
              `Email: ${mockData.personalInfo.email}`,
              `Specialty: ${mockData.personalInfo.specialty}`
            ])}
          </Flex>
        </Card>

        {/* Dynamically generate other cards */}
        <Card className="p-4 bg-gray-800 text-white col-span-1">
          <Title className="text-lg font-bold">Next Appointments</Title>
          {renderItemsWithSeparators(mockData.appointments)}
        </Card>

        <Card className="p-4 bg-gray-800 text-white col-span-1">
          <Title className="text-lg font-bold">Appointment Requests</Title>
          {renderItemsWithSeparators(mockData.requests)}
        </Card>

        <Card className="p-4 bg-gray-800 text-white col-span-1">
          <Title className="text-lg font-bold">Active Patients</Title>
          {renderItemsWithSeparators(mockData.patients)}
        </Card>

        {/* Medical Records Card with greater width */}
        <Card className="p-4 bg-gray-800 text-white col-span-2">
          <Title className="text-lg font-bold">Medical Records</Title>
          {renderItemsWithSeparators(mockData.medicalRecords)}
        </Card>
      </Grid>
    </main>
  );
};

