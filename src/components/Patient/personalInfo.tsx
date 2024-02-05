import React from 'react';

const PersonalInfo = ({ patient }) => {
  // Convert the patient object into an array of key-value pairs
  const patientInfoArray = Object.entries(patient).map(([key, value]) => {
    return { key, value };
  });

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <ul>
        {patientInfoArray.map((info, index) => (
          <li key={index} className="mt-2">
            <p><strong>{info.key}:</strong> {info.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalInfo;

