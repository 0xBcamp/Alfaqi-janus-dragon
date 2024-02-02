import React from 'react';

const ActivePatients = ({ patients }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Active Patients</h2>
      <ul>
        {patients.map((patient, index) => (
          <li key={index} className="mt-2">
            <p>{patient.name} - {patient.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivePatients;
