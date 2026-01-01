import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/login', {
                email: email,
                password: password
            });
            
            if (response.data.status === "success") {
                // Save userid and name for the session [cite: 139]
                localStorage.setItem('userid', response.data.userid);
                localStorage.setItem('userName', response.data.name);
                navigate('/dashboard'); 
            }
        } catch (error) {
            alert(error.response?.data?.detail || "Login failed");
        }
    };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-40 mb-2">Access Portal</h2>
          <h1 className="text-3xl font-light tracking-tighter">Welcome Back.</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="group">
            <label className="text-[10px] tracking-widest uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#222] py-3 outline-none focus:border-white transition-colors text-sm"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="group">
            <label className="text-[10px] tracking-widest uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#222] py-3 outline-none focus:border-white transition-colors text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-10 group flex items-center justify-between py-4 border border-white px-6 hover:bg-white hover:text-black transition-all duration-300"
          >
            <span className="text-xs tracking-[0.3em] uppercase font-bold">Sign In</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-[10px] tracking-widest uppercase opacity-40">
          Don't have an account?{' '}
          <span 
            onClick={() => navigate('/create-account')}
            className="opacity-100 cursor-pointer hover:underline underline-offset-4"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;