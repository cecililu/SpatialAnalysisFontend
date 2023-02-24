import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    house_metric_number: '',
    address: '',
    phone1: '',
    phone2: '',
    building: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://your-api-endpoint/', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-8">
    <div className="mb-4">
      <label htmlFor="house_metric_number" className="block mb-2 font-bold">House Metric Number:</label>
      <input type="text" name="house_metric_number" id="house_metric_number" onChange={handleChange} className="w-full px-3 py-2 border rounded" />
    </div>
    <div className="mb-4">
      <label htmlFor="address" className="block mb-2 font-bold">Address:</label>
      <input type="text" name="address" id="address" onChange={handleChange} className="w-full px-3 py-2 border rounded" />
    </div>
    <div className="mb-4">
      <label htmlFor="phone1" className="block mb-2 font-bold">Phone 1:</label>
      <input type="text" name="phone1" id="phone1" onChange={handleChange} className="w-full px-3 py-2 border rounded" />
    </div>
    <div className="mb-4">
      <label htmlFor="phone2" className="block mb-2 font-bold">Phone 2:</label>
      <input type="text" name="phone2" id="phone2" onChange={handleChange} className="w-full px-3 py-2 border rounded" />
    </div>
    
    <button type="submit" className="block w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Submit</button>
  </form>
  );
};

export default  Form;