import React from 'react';

const Medications = ({ medications }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Medications</h2>
      <ul>
        {medications.map((medication, index) => (
          <li key={index} className="mt-2">
            <p>{medication}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Medications;
