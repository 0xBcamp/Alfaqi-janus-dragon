import React, { useState, useEffect, use } from 'react';
import SearchFilters from './searchFilters';
import DoctorsList from './doctorsList';
import { ethers } from 'ethers';
import { MoonSigner } from '@moonup/ethers';
import { MoonSDK } from '@moonup/ethers/node_modules/@moonup/moon-sdk/';
import { useUserData } from '../userDataContext';
import appointmentContractABI from '../../../solidity/contracts/appointmentsContractABI.json'; // Import the contract ABI
import mainContractABI from '../../../solidity/contracts/mainContractABI.json'; // Import the contract ABI
import { useMoonSDK } from '../usemoonsdk';

const SearchDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({ specialty: '', emergency: '' });
  const [provider, setProvider] = useState(null);
  const [signerAddress, setSignerAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const { userData } = useUserData();
  const moonSDKHook = useMoonSDK();
  const mainContractAddress = process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS;
  const appointmentContractAddress = process.env.NEXT_PUBLIC_APPOINTMENT_CONTRACT_ADDRESS;  

  // Initialize the provider and signer address
  useEffect(() => {
    const fetchProvider = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setSignerAddress(await provider.getSigner().getAddress());
      setChainId((await provider.getNetwork()).chainId.toString());  
    };
    fetchProvider();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const contract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

        // Fetch all doctors from the contract
        const doctorsData = await contract.getAllDoctors();

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
  }, []);
  
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
