import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SearchFilters from './searchFilters';
import DoctorsList from './doctorsList';
import mainContractABI from '../../../solidity/contracts/mainContractABI.json';
import { useMoonSDK } from '../Moon/usemoonsdk';

const SearchDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({ specialty: '', emergency: true || false });
  const moonSDK = useMoonSDK();

  useEffect(() => {
    const fetchDoctors = async () => {
      let currentProvider = null;
      if (moonSDK?.provider) {
        currentProvider = moonSDK.provider;
      } else {
        currentProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_AVAX_RPC_URL);
      }

      try {
        console.log('currentProvider:', currentProvider);

        const mainContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS,
          mainContractABI,
          currentProvider
        );
        const doctorsData = await mainContract.getAllDoctors();

        // Process and set the doctors data
        const doctorsFormatted = doctorsData.map(([walletAddress, doctorInfo]) => ({
          id: walletAddress,
          name: doctorInfo[0],
          email: doctorInfo[1],
          experience: doctorInfo[2].toString(),
          specialty: doctorInfo[3],
          emergency: doctorInfo[4],
          availability: doctorInfo.slice(5),
        }));
        setDoctors(doctorsFormatted);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, [moonSDK, searchParams]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
      <SearchFilters onSearch={setSearchParams} />
      <div className="container mx-auto p-4">
        <DoctorsList doctors={doctors} />
      </div>
    </div>
  );
};

export default SearchDoctorsPage;