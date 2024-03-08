import React, { useState } from "react";

const Record = ({ onSubmit }) => {
  const [recordInfo, setRecordInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(recordInfo);
    setRecordInfo(""); // Reset after submitting
  };

  return (
    <form onSubmit={handleSubmit} className="record-form">
      <textarea
        value={recordInfo}
        onChange={(e) => setRecordInfo(e.target.value)}
        placeholder="Enter consultation info here..."
        className="record-input"
      />
      <button type="submit" className="submit-btn">Submit Record</button>
    </form>
  );
};

export default Record;