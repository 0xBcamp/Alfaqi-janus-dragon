import React from 'react';

const ActivePatients = ({ patients }) => {
  return (
    <div className="p-4">
      <ul>
        {patients.map((patient, index) => (
          <li key={index} className="mt-2">
            <p>{patient}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivePatients;
