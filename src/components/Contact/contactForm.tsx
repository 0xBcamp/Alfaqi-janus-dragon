import React, { useState } from 'react';

const ContactForm: React.FC= () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    documents: null, // Will be used for file upload
    isDoctor: false, // Toggle for showing document upload
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission, including file upload.
    // This might involve sending data to a backend endpoint.
    console.log(formData);
    alert("Form submitted. Check console for data.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="isDoctor">
          <input type="checkbox" id="isDoctor" name="isDoctor" checked={formData.isDoctor} onChange={() => setFormData({ ...formData, isDoctor: !formData.isDoctor })} />
          Are you a doctor?
        </label>
      </div>
      {formData.isDoctor && (
        <div>
          <label htmlFor="documents">Upload Documents</label>
          <input type="file" id="documents" name="documents" onChange={handleChange} />
        </div>
      )}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Submit</button>
    </form>
  );
};

export default ContactForm;
