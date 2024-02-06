import React, { useState } from 'react';
import { Card, Title, Flex, Button } from '@tremor/react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    documents: null,
    isDoctor: false,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted. Check console for data.");
  };

  return (
    <Card className="p-4 bg-gray-800 text-white rounded-lg">
      <Title className="text-lg font-bold mb-4">Contact Form</Title>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="block">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-gray-700 text-white rounded-md p-2" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="bg-gray-700 text-white rounded-md p-2" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="block">Message</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="bg-gray-700 text-white rounded-md p-2" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="isDoctor" className="flex items-center gap-2">
            <input type="checkbox" id="isDoctor" name="isDoctor" checked={formData.isDoctor} onChange={() => setFormData({ ...formData, isDoctor: !formData.isDoctor })} />
            Are you a doctor?
          </label>
        </div>

        {formData.isDoctor && (
          <div className="flex flex-col gap-2">
            <label htmlFor="documents" className="block">Upload Documents</label>
            <input type="file" id="documents" name="documents" onChange={handleChange} className="bg-gray-700 text-white rounded-md p-2" />
          </div>
        )}

        <Button type="submit" className="bg-blue-500 text-white p-2 rounded-lg mt-4">Submit</Button>
      </form>
    </Card>
  );
};

export default ContactForm;
