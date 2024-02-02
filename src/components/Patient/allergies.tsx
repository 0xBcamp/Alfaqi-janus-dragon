import React from 'react';

const Allergies = ({ allergies }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Allergies</h2>
      <ul>
        {allergies.map((allergy, index) => (
          <li key={index} className="mt-2">
            <p>{allergy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Allergies;
