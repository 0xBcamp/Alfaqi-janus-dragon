import React from 'react';

const PersonalData = ({ data }) => {
  return (
    <div className="p-4">
      {/* Displaying data fields, example shown below */}
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Specialty:</strong> {data.specialty}</p>
      {/* Add more fields as necessary */}
    </div>
  );
};

export default PersonalData;
