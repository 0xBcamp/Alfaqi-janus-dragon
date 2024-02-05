'use client';
import React, {useState} from 'react';
import { Card, Text, Title, Flex, Grid, LineChart} from '@tremor/react';
import Allergies from './allergies';
import ChronicIllness from './chronicIlness';
import MedicalRecords from './medicalRecords';
import TestResults from './testResults';
import Medications from './medications';
import Appointments from './appointments';
import PersonalInfo from './personalInfo';
import Permissions from './permissions';

const mockData = {
  medicalRecords: [
    { doctorName: 'Dr. John', date: '2024-01-01', time: '8:43 am', report: 'The patient refer cough for...' },
    { doctorName: 'Dr. Smith', date: '2024-01-25', time: '1:43 pm', report: 'Patient has a history of pain in...' },
    // Add more medical records as needed
  ],
  testResults: [
    { date: '2024-01-01', results: ['Glucose: 110', 'Cholesterol: 200'] },
    { date: '2024-02-02', results: ['Glucose: 125', 'Cholesterol: 180'] },
    { date: '2024-02-03', results: ['Glucose: 160', 'Cholesterol: 152'] },
    { date: '2024-02-04', results: ['Glucose: 150', 'Cholesterol: 130'] }
  ],
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
    category: 'Chronic Illness',
    data: mockData.chronicIllness.map((illness, index) => ({ name: `Illness ${index + 1}`, value: illness })),
  },
  {
    category: 'Permissions',
    data: mockData.permissions.map((permission, index) => ({ name: `Permission ${index + 1}`, value: permission })),
  },
  {
    category: 'Test Results',
    data: mockData.testResults.map((result, index) => ({
      name: `Result ${index + 1}`,
      value: `${result.date} = ${result.results.join(', ')}`,
    })),
  },
  {
    category: 'Medical Records',
    // Transform medicalRecords to include doctorName, date, and report
    data: mockData.medicalRecords.map((record, index) => ({
      name: `Record ${index + 1}`,
      value: record,
    })),
  }
];

export default function PatientDashboard() {
  // Transform testResults to match the expected data structure for the LineChart
  const chartData = mockData.testResults.map(result => {
    const date = result.date;
    const glucose = parseInt(result.results.find(r => r.startsWith('Glucose')).split(': ')[1], 10);
    const cholesterol = parseInt(result.results.find(r => r.startsWith('Cholesterol')).split(': ')[1], 10);
    return { date, glucose, cholesterol };
  });

  const [value, setValue] = useState(null);


  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="dashboard-header mb-8">
        <h1 className="text-2xl font-bold text-center text-color:#233044">Patient Dashboard</h1>
        <hr className="my-4 border-white" />
      </div>
      <Grid className="grid-cols-3 gap-10">
        {data.map((item) => (
          <Card key={item.category} className={`col-span-1 p-4 ${item.category === 'Medical Records' ? 'col-span-3' : ''} bg-gray-800`}>
            <div className="card-header">
              <Title className="text-lg font-bold text-white">{item.category}</Title>
              <hr className="my-2 border-white" /> {/* Add hr after each category title */}
            </div>
            <Flex flexDirection="column" gap="2" className="mt-4">
              {item.category === 'Medical Records' ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {item.data.map((record, index) => (
                    <React.Fragment key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <Text className="subtitle">{`Doctor: ${record.value.doctorName}`}</Text>
                        <Text className="subtitle text-right">{`Date: ${record.value.date}, ${record.value.time}`}</Text>
                      </div>
                      <Text className="text-base text-white">{record.value.report}</Text>
                      {index < item.data.length - 1 && <hr className="my-2 border-white w-full" />}
                    </React.Fragment>
                  ))}
                </div>
              ) : item.category === 'Personal Info' ? (
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
                      {index < item.data.length - 1 && <hr className="my-2 border-white w-full" />}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </Flex>
          </Card>
        ))}
      <Card className="col-span-3 p-4 bg-gray-800">
        <Title className="text-lg font-bold text-white">Health Overview</Title>
        <LineChart
          className="h-72 mt-4"
          data={chartData}
          index="date"
          categories={['glucose', 'cholesterol']}
          showXAxisoptional={true}
          showAnimation={true}
          yAxisWidth={30}
          onValueChange={(v) => setValue(v)}
          connectNulls={true}
        />
      </Card>
      </Grid>
    </main>
  );
}  