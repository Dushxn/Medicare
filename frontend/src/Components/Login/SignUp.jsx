import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });
      setMessage('Registration successful! Redirecting to login...');
      setAlertType('success');
      setTimeout(() => {
        window.location.href = '/login'; // Redirect to login page after 2 seconds
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.message || 'An error occurred');
      setAlertType('error');
    }
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='container shadow-[0_-4px_6px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] w-[400px] h-[400px] md:w-[700px] md:h-[500px] mx-auto my-10 relative rounded-lg'>
        <div className='flex flex-row gap-y-5 p-5'>
          <div className='flex justify-center h-full w-full'>
            <h1 className='text-2xl md:text-3xl font-sans font-bold mt-4'>Sign Up</h1>
          </div>
        </div>
        <form className='flex flex-col w-full gap-y-3' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='Name'
            className='w-[300px] md:w-[600px] mx-auto p-3 rounded-xl mt-10 bg-gray-100'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder='Email'
            className='w-[300px] md:w-[600px] mx-auto p-3 rounded-xl mt-3 bg-gray-100'
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
              Sign Up
            </button>
          </div>
          <div className='w-full flex justify-center'>
            <h4 className='mt-4 md:mt-4 text-gray-400 text-sm md:text-lg'>
              already have an account?
              <span className='text-blue-500 font-bold'>
                <a href="/login"> Log In</a>
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

export default SignUp;
