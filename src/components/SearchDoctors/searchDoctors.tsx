import React, { useState, useEffect } from 'react';
import SearchFilters from './searchFilters';
import DoctorsList from './doctorsList';
import { ethers } from 'ethers';
import { MoonSigner } from '@moonup/ethers';
import { MoonSDK } from '@moonup/ethers/node_modules/@moonup/moon-sdk/';
import { useUserData } from '../userDataContext';
import appointmentContractABI from '../../../solidity/contracts/appointmentsContractABI.json'; // Import the contract ABI
import mainContractABI from '../../../solidity/contracts/mainContractABI.json'; // Import the contract ABI
import { useMoonSDK } from '../usemoonsdk';

const SearchDoctorsPage = async () => {
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({ specialty: '', emergency: '' });
  const { userData } = useUserData();
  const moonSDKHook = useMoonSDK();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signerAddress = await provider.getSigner().getAddress();
  const chainId = (await provider.getNetwork()).chainId.toString();

  // Assume you have your contract ABI and address available
  const mainContractAddress = process.env.MAIN_CONTRACT_ADDRESS; // env variable
  const appointmentContractAddress = process.env.APPOINTMENT_CONTRACT_ADDRESS; // env variable

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const contract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

        // Fetch all doctors from the contract
        // You might need to adjust this based on how your contract exposes doctor data
        const doctorsData = await contract.getAllDoctors(); // This function needs to exist in your contract

        // Process and set the doctors data
        // You'll need to adjust this part based on the actual structure of your doctor data
        const doctorsFormatted = doctorsData.map(doctor => ({
          name: doctor.doctorInfo.name,
          specialty: doctor.doctorInfo.specialty,
          experience: doctor.doctorInfo.timeExperience,
          avaliability: doctor.doctorInfo.availableTimes,
          emergency: doctor.doctorInfo.emergency,
          address: doctor.doctorAddress
        }));
        
        setDoctors(doctorsFormatted);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array means this effect runs once on component mount
  
  // Initialize appointments contract
  const initAppointmentsContract = () => {
      // Now we use the moon instance directly from moonSDKHook
      const signer = new MoonSigner({
        SDK: moonSDKHook.moon as unknown as MoonSDK,
        address: signerAddress,
        chainId,
      });
    const contract = new ethers.Contract(appointmentContractAddress, appointmentContractABI, signer);
    return contract;
    };
  
  // Function to handle appointment requests
  const requestAppointment = async (doctor, timestamp, reason) => {
    // Make sure the user's address is available from `useUserData`
    if (!userData.address) {
      console.error("User address not found. Please connect your wallet.");
      return;
    }
  
    const contract = initAppointmentsContract();
    try {
      // Ensure parameters are correctly passed and used in the smart contract call
      const tx = await contract.requestAppointment(doctor.address, timestamp, reason);
      await tx.wait();
      
      const permission = await contract.grantPermissionToDoctor(userData.address, doctor.address);
      await permission.wait();

      console.log('Appointment requested successfully.');

    } catch (error) {
      console.error('Error requesting appointment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
      <SearchFilters onSearch={setSearchParams} />
      <DoctorsList doctors={doctors} onRequestAppointment={requestAppointment} />
    </div>
  );
};

export default SearchDoctorsPage;
