import React from 'react';

const ChronicIllness = ({ illness }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Test Results</h2>
      <ul>
        {illness.map((ill, index) => (
          <li key={index} className="mt-2">
            <p>{ill}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChronicIllness;
