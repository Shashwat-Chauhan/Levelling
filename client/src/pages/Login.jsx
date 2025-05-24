import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200) {
        console.log('Login Success');
        const {token , userId} = res.data
        // Optional: store token
        // localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        console.log('Login failed:', res.data);
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{' '}
          <span
            className="text-purple-400 cursor-pointer hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
