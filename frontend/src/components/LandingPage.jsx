import React from 'react';
import { useNavigate } from 'react-router-dom';
import rvceLogo from '../assets/RVCE_logo.png'; // Adjust path based on your folder

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Header with Logos */}
      <nav className="p-8 flex justify-between items-start border-b border-[#1a1a1a]">
        <div>
          <h2 className="text-xs tracking-[0.3em] uppercase opacity-60">Institution</h2>
        <img src={rvceLogo} alt="RVCE Logo" className="h-20 mt-2 mb-1" />
          <h1 className="text-xl font-medium mt-1">RV College of Engineering® </h1>
          <p className="text-sm opacity-50">Department of AI & Machine Learning </p>
        </div>
        <div className="text-right">
          <h2 className="text-xs tracking-[0.3em] uppercase opacity-60">Course</h2>
          <h1 className="text-xl font-medium mt-1">DBMS Lab (CD252IA)</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-24 px-8">
        <h2 className="text-xs tracking-[0.5em] uppercase opacity-40 mb-4">Project Synopsis</h2>
        <p>This system is a centralized web platform designed for efficient personal finance management. It allows users to track income and expenses using manual entry or OCR-based receipt scanning, automatically classifying transactions through ML prediction models. By offering visual analytics, category-wise budget management, and proactive spending alerts, the application encourages financial discipline and literacy.</p>
        <h1 className="text-6xl font-light tracking-tight mb-12 leading-tight">
          Personal Finance & <br /> 
          <span className="opacity-50 italic">Expense Management.</span> 
        </h1>

        <div className="grid grid-cols-2 gap-12 border-t border-[#1a1a1a] pt-12">
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase opacity-40 mb-4">Presented By</h3>
            <p className="text-lg">P Himashree Perumalla </p>
            <p className="text-lg">Priyansh Poddar </p>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase opacity-40 mb-4">Acknowledgment</h3>
            <p className="text-sm leading-relaxed opacity-70">
              We express our gratitude to the Department of Artificial Intelligence and Machine Learning 
              for providing the resources and guidance to develop this local-first RDBMS & NoSQL hybrid system. 
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-20 flex gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white text-black font-medium hover:bg-opacity-90 transition-all uppercase text-xs tracking-widest"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/create-account')}
            className="px-10 py-4 border border-[#333] hover:border-white transition-all uppercase text-xs tracking-widest"
          >
            Create Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;