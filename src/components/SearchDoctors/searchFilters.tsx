import React, { useState } from 'react';

const SearchFilters = ({ onSearch }) => {
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ specialty, date });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="specialty" className="block">Specialty</label>
        <select id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
          <option value="">Select Specialty</option>
          {/* Dynamically populate specialties */}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Search</button>
    </form>
  );
};

export default SearchFilters;