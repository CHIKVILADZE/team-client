import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import axios from 'axios';
import TableComponent from './TableComponent';
import InputMask from 'react-input-mask';

function FormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cancelRequest = useRef(null);

  const onSubmit = (data) => {
    setLoading(true);
    setErrorMessage('');

    if (cancelRequest.current) {
      cancelRequest.current.cancel('Operation canceled by the user.');
    }

    cancelRequest.current = axios.CancelToken.source();

    axios
      .get(`https://team-server-0oy2.onrender.com/search`, {
        params: {
          email: data.email,
          ...(data.number && { number: data.number }),
        },
        cancelToken: cancelRequest.current.token,
      })
      .then((response) => {
        console.log('GET request response:', response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error('Error making GET request:', error.response.data.error);
          setErrorMessage(error.response.data.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div
        className="container mt-5 d-flex flex-column align-items-center rounded-4 text-white bg-info p-3"
        style={{ width: '400px' }}
      >
        <h1>FormComponent</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && <h3 className="text-danger">{errorMessage}</h3>}
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="name@example.com"
              {...register('email', { required: true })}
              style={{ width: '300px' }}
            />
            {errors.email && <p style={{ color: 'red' }}>Email is required.</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="numberInput" className="form-label">
              Number (Optional)
            </label>
            <InputMask
              mask="99-99-99"
              maskChar="_"
              className={`form-control no-arrow ${
                errors.number ? 'is-invalid' : ''
              }`}
              placeholder="Enter a number"
              {...register('number', { pattern: /^\d{2}-\d{2}-\d{2}$/ })}
              style={{ width: '300px' }}
            />
            {errors.number && (
              <p style={{ color: 'red' }}>Number should be exactly 6 digits.</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div style={{ width: '400px' }} className="mt-4">
        {loading ? <p>Loading...</p> : <TableComponent users={users} />}
      </div>
    </div>
  );
}

export default FormComponent;
