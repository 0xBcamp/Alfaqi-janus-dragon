import React from 'react';

const NextAppointments = ({ appointments }) => {
  return (
    <div className="p-4">
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index} className="mt-2">
            <p>{appointment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextAppointments;
