import React from 'react';

const PersonalData = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Personal Data</h2>
      {/* Displaying data fields, example shown below */}
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      {/* Add more fields as necessary */}
    </div>
  );
};

export default PersonalData;
