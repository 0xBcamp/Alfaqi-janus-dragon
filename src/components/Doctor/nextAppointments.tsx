import React from 'react';

const NextAppointments = ({ appointments }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Next Appointments</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index} className="mt-2">
            <p><strong>{appointment.patientName}</strong> - {appointment.date} at {appointment.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextAppointments;
