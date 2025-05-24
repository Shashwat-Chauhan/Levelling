import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear previous errors

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("https://levelling-production.up.railway.app/user/signup", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200 || res.status === 201) {
        console.log('Signup Success');
        navigate("/dashboard");
      } else {
        setErrorMsg(res.data.message || 'Signup failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong during signup.";
      console.error('Signup error:', message);
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create an Account</h2>
        {errorMsg && (
          <div className="mb-4 text-red-500 text-sm text-center">{errorMsg}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <span
            className="text-purple-400 cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
