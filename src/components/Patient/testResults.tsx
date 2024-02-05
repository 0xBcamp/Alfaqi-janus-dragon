import React from 'react';

const TestResults = ({ results }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Test Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index} className="mt-2">
            <p>{result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestResults;
