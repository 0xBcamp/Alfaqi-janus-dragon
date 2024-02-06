import React, { useState, useEffect } from 'react';
import SearchFilters from './searchFilters';
import DoctorsList from './doctorsList';

const SearchDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({ specialty: '', date: '', emergency: '' });

  useEffect(() => {
    // Fetch doctors based on searchParams
    // This is a placeholder. You'll need to replace it with actual API call.
    const fetchDoctors = async () => {
      // Assume this function fetches doctors based on search criteria
      const response = await fetch(`/api/doctors?specialty=${searchParams.specialty}&date=${searchParams.date}&emergency=${searchParams.emergency}`);
      const data = await response.json();
      setDoctors(data);
    };

    if (searchParams.specialty && searchParams.date) {
      fetchDoctors();
    }
  }, [searchParams]);

  const handleSearch = (criteria) => {
    setSearchParams(criteria);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
      <SearchFilters onSearch={handleSearch} />
      <DoctorsList doctors={doctors} />
    </div>
  );
};

export default SearchDoctorsPage;
