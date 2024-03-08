import React, { useState } from 'react';

const SearchFilters = ({ onSearch }) => {
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ specialty});
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="specialty" className="block">Specialty</label>
        <select id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
          <option value="">Select Specialty</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Generalist">Generalist</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Search</button>
    </form>
  );
};

export default SearchFilters;