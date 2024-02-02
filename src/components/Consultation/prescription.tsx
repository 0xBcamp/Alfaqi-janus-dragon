import React from 'react';

const Prescription = ({ prescription, isDoctor }) => {
  if (isDoctor) {
    // Doctor's view to create or edit a prescription
    return (
      <form>
        {/* Form for creating/editing prescription */}
      </form>
    );
  } else {
    // Patient's view to see the prescription
    return (
      <div>
        {prescription ? (
          <p>{prescription.content}</p>
        ) : (
          <p>No prescription available.</p>
        )}
      </div>
    );
  }
};

export default Prescription;