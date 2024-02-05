'use client';
import React from 'react';
import { Card, Text, Title, Flex, Grid } from '@tremor/react';
import Allergies from './allergies';
import ChronicIllness from './chronicIlness';
import MedicalRecords from './medicalRecords';
import TestResults from './testResults';
import Medications from './medications';
import Appointments from './appointments';
import PersonalInfo from './personalInfo';
import Permissions from './permissions';

const mockData = {
  medicalRecords: ['The patient refer cough for...', 'Patient has a history of pain in...'],
  testResults: ['Glucose: 110', 'Cholesterol: 200'],
  allergies: ['Acetylsalicylic acid', 'Penicillin'],
  chronicIllness: ['Diabetes', 'Hyperthyroidism'],
  permissions: ['Dr. John', 'Dr. Smith'],
  medications: ['Paracetamol', 'Ibuprofen'],
  patient: {
    Gender: 'Female',
    Age: '56',
    BloodType: 'A+',
    Height: '1.65m',
    Weight: '55kg'
    // ... other patient info
  },
};

const patientInfo = Object.entries(mockData.patient).map(([key, value]) => ({
  name: key,
  value: value,
}));

const data = [
  {
    category: 'Personal Info',
    data: patientInfo,
  },
  {
    category: 'Allergies',
    data: mockData.allergies.map((allergy, index) => ({ name: `Allergy ${index + 1}`, value: allergy })),
  },
  {
    category: 'Medications',
    data: mockData.medications.map((medication, index) => ({ name: `Medication ${index + 1}`, value: medication })),
  },
  {
    category: 'Test Results',
    data: mockData.testResults.map((result, index) => ({ name: `Result ${index + 1}`, value: result })),
  },
  {
    category: 'Chronic Illness',
    data: mockData.chronicIllness.map((illness, index) => ({ name: `Illness ${index + 1}`, value: illness })),
  },
  {
    category: 'Permissions',
    data: mockData.permissions.map((permission, index) => ({ name: `Permission ${index + 1}`, value: permission })),
  },
  {
    category: 'Medical Records',
    data: mockData.medicalRecords.map((record, index) => ({ name: `Record ${index + 1}`, value: record })),
  },
];

export default function PatientDashboard() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="dashboard-header mb-8">
        <h1 className="text-white text-2xl font-bold">Patient Dashboard</h1>
      </div>
      <Grid className="grid-cols-3 gap-10">
        {data.map((item) => (
          <Card key={item.category} className={`col-span-1 p-4 ${item.category === 'Medical Records' ? 'col-span-3' : ''} bg-gray-800`}>
            <Title className="text-lg font-bold text-white">{item.category}</Title>
            <Flex flexDirection="column" gap="2" className="mt-4">
              {item.category === 'Personal Info' ? (
                <div className="grid grid-cols-2 gap-4">
                  {item.data.map((info, index) => (
                    <Text key={index} className="text-base text-white">{`${info.name}: ${info.value}`}</Text>
                  ))}
                </div>
              ) : (
                <ul className="list-none p-0">
                  {item.data.map((info, index) => (
                    <React.Fragment key={index}>
                      <li>
                        <Text className="text-base text-white">{info.value}</Text>
                      </li>
                      {index < item.data.length - 1 && <hr className="my-2 border-white" />}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </Flex>
          </Card>
        ))}
      </Grid>
    </main>
  );
}