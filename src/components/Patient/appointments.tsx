import React from 'react';

const Appointments = ({ appointments }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Appointments</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index} className="mt-2">
            <p><strong>{appointment.doctorName}</strong> - {appointment.date}: {appointment.outcome}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
