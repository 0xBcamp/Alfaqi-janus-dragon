import React from 'react';

const MedicalRecords = ({ records }) => {
  return (
    <div className="p-4">
      <ul>
        {records.map((record, index) => (
          <li key={index} className="mt-2">
          <p>{record}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecords;
