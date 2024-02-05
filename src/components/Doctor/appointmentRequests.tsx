import React from 'react';

const AppointmentRequests = ({ requests }) => {
  return (
    <div className="p-4">
      <ul>
        {requests.map((request, index) => (
          <li key={index} className="mt-2">
            <div>
              <p>Request for {request} consultation</p>
              <button className="bg-blue-500 text-white p-2 rounded-lg">Accept</button>
              <button className="bg-red-500 text-white p-2 ml-2 rounded-lg">Decline</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentRequests;
