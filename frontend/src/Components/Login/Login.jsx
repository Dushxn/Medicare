import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice'; // Adjust the import based on your actual user slice

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token, user } = response.data;

      // Save user details to Redux store
      dispatch(login(user));

      // Save token to local storage
      localStorage.setItem('token', token);

      // Clear form fields
      setEmail('');
      setPassword('');

      // Redirect based on userType
      if (user.userType === 'admin') {
        window.location.href = '/adminProfile'; // Redirect to admin profile
      } else if (user.userType === 'user') {
        window.location.href = '/patientProfile'; // Redirect to patient profile
      } else {
        window.location.href = '/'; // Default redirect
      }
    } catch (error) {
      setMessage(error.response.data.message || 'An error occurred');
      setAlertType('error');
    }
    console.log(user.userType)
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='container shadow-[0_-4px_6px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] w-[400px] h-[400px] md:w-[700px] md:h-[500px] mx-auto my-10 relative rounded-lg'>
        <div className='flex flex-row gap-y-5 p-5'>
          <div className='flex justify-center h-full w-full'>
            <h1 className='text-2xl md:text-3xl font-sans font-bold mt-4'>Login</h1>
          </div>
        </div>
        <form className='flex flex-col w-full gap-y-3' onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder='Email'
            className='w-[300px] md:w-[600px] mx-auto p-3 rounded-xl mt-10 bg-gray-100'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder='Password'
            className='w-[300px] md:w-[600px] mx-auto p-3 rounded-xl mt-3 bg-gray-100'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className='w-full flex justify-center'>
            <button
              type="submit"
              className='w-[300px] md:w-[600px] mt-8 bg-blue-500 p-3 rounded-xl mx-auto items-center text-white'
            >
              Submit
            </button>
          </div>
          <div className='w-full flex justify-center'>
            <h4 className='mt-4 md:mt-8 text-gray-400 text-sm md:text-lg'>
              Not Registered? 
              <span className='text-blue-500 font-bold'>
                <a href="/signup"> Create an Account</a>
              </span>
            </h4>
          </div>
          {message && (
            <div className={`mt-4 text-center ${alertType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
