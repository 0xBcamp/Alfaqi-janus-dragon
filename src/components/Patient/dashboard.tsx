'use client';
import React, {useEffect, useState} from 'react';
import { Card, Text, Title, Flex, Grid, LineChart} from '@tremor/react';
import { useUserData } from '../userDataContext';
import { ethers } from 'ethers';
import { getDataFromIPFS } from '../ipfsHelia';
import { decryptData } from '../encryptData';
import appointmentContractABI from '../../../solidity/contracts/appointmentsContractABI.json';
import mainContractABI from '../../../solidity/contracts/mainContractABI.json';

export default function PatientDashboard() {
  const [testResults, setTestResults] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [chronicIllness, setChronicIllness] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [value, setValue] = useState(null);

  const mainContractAddress = process.env.REACT_APP_MAIN_CONTRACT_ADDRESS;
  const appointmentContractAddress = process.env.REACT_APP_APPOINTMENT_CONTRACT_ADDRESS;
  const userData = useUserData();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const mainContract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

  const appointmentContract = new ethers.Contract(appointmentContractAddress, appointmentContractABI, provider);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const records = await mainContract.getPatientMedicalRecords(userData.userData.address);
        const decrytedRecords = await Promise.all(records.map(async record => {
          decryptData(getDataFromIPFS(record));
        }))

        const formattedRecords = decrytedRecords.map(async record => ({
          doctorAddress: record.doctorAdress,
          date: record.reportDate,
          report: await decryptData(getDataFromIPFS(record.ipfsHash)),
        }));

        setMedicalRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };

    if (userData.userData.address) {
      fetchMedicalRecords();
    }
  }, [userData.userData.address]);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const allergies = await mainContract.getPatientInfo(userData.userData.address).allergies;
        setAllergies(allergies);
      } catch (error) {
        console.error('Error fetching allergies:', error);
      }
    };

    if (userData.userData.address) {
      fetchAllergies();
    }
  }, [userData.userData.address]);

  useEffect(() => {
    const fetchChronicIllness = async () => {
      try {
        const illnesses = await mainContract.getPatientInfo(userData.userData.address).preIllness;
        setChronicIllness(illnesses);
      } catch (error) {
        console.error('Error fetching chronic illness:', error);
      }
    };

    if (userData.userData.address) {
      fetchChronicIllness();
    }
  }, [userData.userData.address]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const medications = await mainContract.getPatientInfo(userData.userData.address).medications;
        setMedications(medications);
      } catch (error) {
        console.error('Error fetching medications:', error);
      }
    };

    if (userData.userData.address) {
      fetchMedications();
    }
  }, [userData.userData.address]);
  
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const results = await mainContract.getPatientTestResults(userData.userData.address);
        const decrytedResults = await Promise.all(results.map(async result => {
          decryptData(getDataFromIPFS(result));
        }))

        const formattedResults = decrytedResults.map(result => ({
          date: result.date,
          results: result.values.map(value => `${value.name}: ${value.level}`),
        }));

        setTestResults(formattedResults);
      } catch (error) {
        console.error('Error fetching test results:', error);
      }
    };

    if (userData.userData.address) {
      fetchTestResults();
    }
  }, [userData.userData.address]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = await appointmentContract.getPatientAppointments();
        setAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (userData.userData.address) {
      fetchAppointments();
    }
  }, [userData.userData.address]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await mainContract.getPatientPermissions(userData.userData.address);
        setPermissions(permissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    if (userData.userData.address) {
      fetchPermissions();
    }
  }, [userData.userData.address]);

  // Create the data array dynamically based on fetched data
  const data = [
    {
      category: 'Allergies',
      data: allergies.map((allergy, index) => ({ name: `Allergy ${index + 1}`, value: allergy })),
    },
    {
      category: 'Medications',
      data: medications.map((medication, index) => ({ name: `Medication ${index + 1}`, value: medication })),
    },
    {
      category: 'Chronic Illness',
      data: chronicIllness.map((illness, index) => ({ name: `Illness ${index + 1}`, value: illness })),
    },
    {
      category: 'Appointments',
      data: appointments.map((appointment, index) => ({
        name: `Appointment ${index + 1}`,
        doctorAddress: appointment.doctorAddress, // Adjust as per your data structure
        date: appointment.timestamp,
        reason: appointment.reason,
      })),
    },
    {
      category: 'Permissions',
      data: permissions.map((permission, index) => ({ name: `Permission ${index + 1}`, value: permission })),
    },
    {
      category: 'Test Results',
      data: testResults.map((result, index) => ({
        name: `Result ${index + 1}`,
        value: `${result.date} = ${result.results.join(', ')}`,
      })),
    },
    {
      category: 'Medical Records',
      data: medicalRecords.map((record, index) => ({
        name: `Record ${index + 1}`,
        doctorAddress: record.doctorAddress, // Adjust as per your data structure
        date: record.date,
        report: record.report,
      })),
    },
  ];

  // Transform testResults to match the expected data structure for the LineChart
  const chartData = testResults.map(result => {
    const date = result.date;
    const glucose = parseInt(result.results.find(r => r.startsWith('Glucose')).split(': ')[1], 10);
    const cholesterol = parseInt(result.results.find(r => r.startsWith('Cholesterol')).split(': ')[1], 10);
    return { date, glucose, cholesterol };
  });


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
            <Flex className="flex flex-col gap-2 mt-4">
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