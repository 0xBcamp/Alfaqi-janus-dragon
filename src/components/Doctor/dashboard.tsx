import React from 'react';
import MedicalRecords from './../Patient/medicalRecords';
import NextAppointments from './nextAppointments';
import AppointmentRequests from './appointmentRequests';
import ActivePatients from './activePatients';
import PersonalData from './personalData';

const MedicDashboard = () => {
  const mockData = {
    medicalRecords: ['...', '...'],
    appointments: ['...', '...'],
    requests: ['...', '...'],
    patients: ['...', '...'],
    personalData: ['...', '...'],
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-center my-4">Medic Dashboard</h1>
      <MedicalRecords records={mockData.medicalRecords} />
      <NextAppointments appointments={mockData.appointments} />
      <AppointmentRequests requests={mockData.requests} />
      <ActivePatients patients={mockData.patients} />
      <PersonalData data={mockData.personalData} />
    </div>
  );
};

export default MedicDashboard;
