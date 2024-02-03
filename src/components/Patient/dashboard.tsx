import React from 'react';
import MedicalRecords from './medicalRecords';
import TestResults from './testResults';
import Allergies from './allergies';
import ChronicIlness from './chronicIlness';
import Permissions from './permissions';
import Medications from './medications';


const PatientDashboard = () => {
  const mockMedicalRecords = ['...', '...'],
  const mockTestResults = ['...', '...'],
  const mockAllergies = ['...', '...'],
  const mockChronicIlness = ['...', '...'],
  const mockPermissions = ['...', '...'],
  const mockMedications = ['...', '...'],

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-center my-4">Patient Dashboard</h1>
      <MedicalRecords records={mockMedicalRecords} />
      <TestResults results={mockTestResults} />
      <Allergies allergies={mockAllergies} />
      <ChronicIlness chronicIllness={mockChronicIlness} />
      <Permissions permissions={mockPermissions} />
      <Medications medications={mockMedications} />
    </div>
  );
};

export default PatientDashboard;
