import React, { useEffect, useState } from 'react';
import { useUserData } from '../userDataContext';
import { getDataFromIPFS } from '../ipfsHelia';
import { decryptData } from '../encryptData';
import mainContractABI from '../../../solidity/contracts/mainContractABI.json';
import { ethers } from 'ethers';


const PatientRecords = () => {
  const userData = useUserData();
  const [records, setRecords] = useState([]);

  // Retrieve the main contract address from the environment
  const mainContractAddress = process.env.REACT_APP_MAIN_CONTRACT_ADDRESS;
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const mainContract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await mainContract.getPatientMedicalRecords(userData.userData.address);
        const formattedRecords = records.map(async record => {
          const doctorName = await mainContract.getDoctorName(record.doctorAddress);
          return {
            doctorName,
            date: record.reportDate,
            time: record.reportTime,
            report: await decryptData(getDataFromIPFS(record.ipfsHash)),
          };
        });

        setRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    if (userData.userData.address) {
      fetchRecords();
    }
  }, [userData.userData.address]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Patient Medical Records</h2>
      <ul>
        {records.map((record, index) => (
          <li key={index} className="mt-2">
            <p>{record.doctorName}</p>
            <p>{record.date}</p>
            <p>{record.time}</p>
            <p>{record.report}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientRecords;