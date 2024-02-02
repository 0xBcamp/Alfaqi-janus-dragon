import React from 'react';

const DoctorsList = ({ doctors }) => {
  return (
    <div>
      {doctors.length > 0 ? (
        <ul className="space-y-4">
          {doctors.map((doctor) => (
            <li key={doctor.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{doctor.name}</h3>
              <p>Specialty: {doctor.specialty}</p>
              <p>Available: {doctor.times.join(', ')}</p>
              {doctor.emergency && <span className="text-red-500">Accepts Emergency Consultations</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No doctors available matching your criteria.</p>
      )}
    </div>
  );
};

export default DoctorsList;