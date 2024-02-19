import React, { useState, useEffect, use } from 'react';
import SearchFilters from './searchFilters';
import DoctorsList from './doctorsList';
import  ethers from 'ethers';
import { MoonSigner } from '@moonup/ethers';
import { MoonSDK } from '@moonup/ethers/node_modules/@moonup/moon-sdk/';
import { useUserData } from '../userDataContext';
import { useMoonSDK } from '../usemoonsdk';
import mainContractABI from '../../../solidity/contracts/mainContractABI.json';
import appointmentContractABI from '../../../solidity/contracts/appointmentsContractABI.json';

const SearchDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({ specialty: '', emergency: true || false});
  const [provider, setProvider] = useState(null);
  const [signerAddress, setSignerAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const { userData } = useUserData();
  const moonSDKHook = useMoonSDK();
  const mainContractAddress = process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS;
  const appointmentContractAddress = process.env.NEXT_PUBLIC_APPOINTMENT_CONTRACT_ADDRESS;  
  const avalancheFujiTestnetRPC = "https://rpc.ankr.com/avalanche_fuji";

  useEffect(() => {
    const fetchProvider = async () => {
      const provider = new ethers.providers.JsonRpcProvider(avalancheFujiTestnetRPC);

      setProvider(provider);
      setSignerAddress(await provider.getSigner().getAddress());
      setChainId((await provider.getNetwork()).chainId.toString());  
  
    }
    fetchProvider();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!provider) {
        console.error("Provider not initialized. Please check your connection.");
        return;
      }
      
      try {
        const contract = new ethers.Contract(mainContractAddress, mainContractABI, provider);
        console.log('Contract fetched', contract);

        // Fetch all doctors from the contract
        const doctorsData = await contract.getAllDoctors();
        console.log("Doctors fetched", doctorsData);

        // Process and set the doctors data

        const doctorsFormatted = doctorsData.map(doctor => ({
          id: doctor.walletAddress,
          name: doctor.doctorInfo.name,
          email: doctor.doctorInfo.email,
          specialty: doctor.doctorInfo.specialty,
          experience: doctor.doctorInfo.timeExperience,
          avaliability: doctor.doctorInfo.availableTime,
          emergency: doctor.doctorInfo.emergencyAppointment,
        }));
        console.log('Doctors formatted', doctorsFormatted);
        
        setDoctors(doctorsFormatted);
        console.log('Doctors set', doctorsFormatted);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);
  
  // Initialize appointments contract
  const initAppointmentsContract = () => {
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
