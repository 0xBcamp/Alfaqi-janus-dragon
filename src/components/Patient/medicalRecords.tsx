import React from 'react';

const MedicalRecords = ({ records }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Medical Records</h2>
      <ul>
        {records.map((record, index) => (
          <li key={index} className="mt-2">
            <p>{record.date}: {record.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecords;
