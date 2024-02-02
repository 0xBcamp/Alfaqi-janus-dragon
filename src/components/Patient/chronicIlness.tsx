import React from 'react';

const ChronicIllness = ({ chronicIllness }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">ChronicIllness</h2>
      <ul>
        {chronicIllness.map((chronicIll, index) => (
          <li key={index} className="mt-2">
            <p>{chronicIll}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChronicIllness;
