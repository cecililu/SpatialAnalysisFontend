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
    <form onSubmit={handleSubmit}>
      <label>
        House Metric Number:
        <input type="text" name="house_metric_number" onChange={handleChange} />
      </label>
      <label>
        Address:
        <input type="text" name="address" onChange={handleChange} />
      </label>
      <label>
        Phone 1:
        <input type="text" name="phone1" onChange={handleChange} />
      </label>
      <label>
        Phone 2:
        <input type="text" name="phone2" onChange={handleChange} />
      </label>
      <label>
        Building:
        <input type="text" name="building" onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default  Form;