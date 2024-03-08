import React, { useEffect, useState } from 'react';
import { useUserData } from '../Contexts/userDataContext';
import { getDataFromIPFS } from '../IPFS/ipfsHelia';
import { decryptData } from '../IPFS/encryptData';
import mainContractABI from '../../../solidity/contracts/mainContractABI.json';
import { ethers } from 'ethers';
import { Card, Title } from '@tremor/react';

const PatientRecords = () => {
  const { userData } = useUserData();
  const [records, setRecords] = useState([]);
  const [provider, setProvider] = useState(null);
  const mainContractAddress = process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS;  

  useEffect(() => {
    const fetchProvider = async () => {
      const avalancheFujiTestnetRPC = "https://avalanche-fuji-c-chain.publicnode.com";
      const provider = new ethers.providers.JsonRpcProvider(avalancheFujiTestnetRPC);
      setProvider(provider);
    };

    fetchProvider();
  }, []);

  const mainContract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await mainContract.getPatientMedicalRecords(userData.address);
        const formattedRecordsPromises = records.map(async record => {
          const doctorName = await mainContract.getDoctorName(record.doctorAddress);
          const reportData = await getDataFromIPFS(record.ipfsHash);
          const decryptedReport = await decryptData(reportData);
          return {
            doctorName,
            date: record.reportDate,
            time: record.reportTime,
            report: decryptedReport,
          };
        });
  
        const formattedRecords = await Promise.all(formattedRecordsPromises);
        setRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
  
    if (userData.address && provider) { // Ensure provider is set before fetching
      fetchRecords();
    }
  }, [userData.address, provider]); // Add provider to the dependency array

  return (
    <div className="h-full">
      <Card className="p-4 bg-gray-800 text-white rounded-lg w-full h-1/2">
        <Title className="text-lg font-bold mb-4">Patient Medical Records</Title>
          <ul className="overflow-auto">
            {records.map((record, index) => (
              <li key={index} className="mt-2">
                <p>{record.doctorName}</p>
                <p>{record.date}</p>
                <p>{record.time}</p>
                <p>{record.report}</p>
              </li>
            ))}
          </ul>
      </Card>
    </div>
  );
}

export default PatientRecords;