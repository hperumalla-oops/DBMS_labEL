import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',name: '', email: '', password: '', confirmPassword: ''
  });
  // State to hold budget inputs
  const [budgets, setBudgets] = useState({ Food: 0, Travel: 0, Rent: 0, Games: 0 });

  // Update form data state
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Handle User Registration
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    try {
        console.log("Sending signup data to backend...");
        const response = await API.post('/create-account', {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        
        if (response.data.userid) {
            localStorage.setItem('temp_user_id', response.data.userid);
            setStep(2); // Proceed to Category & Budget Setup [cite: 131]
        }
        
    } catch (error) {
        console.error("Signup Error:", error);
        alert(error.response?.data?.detail || "Registration failed");
    }
  };

  // Step 2: Handle Budget Finalization
  const handleFinalizeAccount = async () => {
    const userId = localStorage.getItem('temp_user_id');
    console.log("Checking LocalStorage UserID:", userId); // IF THIS IS NULL, THE BUTTON WON'T WORK
    
    if(!userId) {
        alert("User session not found. Please sign up again.");
        return;
    }
    
    try {
        // In a real demo, you'd loop through categories. 
        // For Friday, let's just send the first one to prove it works[cite: 135].
        // await API.post('/set-budget', {
        //     user_id: parseInt(userId),
        //     category_id: 1, // Ensure ID 1 exists in your 'category' table
        //     limit_amount: parseFloat(budgets.Food),
        //     m  onth: "December" 
        // });se

        await API.post('/set-budget', {
            userid: userId,              // STRING, not int
            category_name: "Food",        // REQUIRED
            limit_amount: Number(budgets.Food),
            month: "December"
        });

        alert("Account and Budget Setup Complete!");
        navigate('/login');
    } catch (error) {
        console.error("Budget setup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 border border-[#1a1a1a] bg-[#050505]">
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.4em] uppercase opacity-40">Step 0{step} / 02</span>
          <h2 className="text-2xl mt-2">{step === 1 ? "Authentication" : "Environment Setup"}</h2>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSignup} className="space-y-6">
            <input name="username" onChange={handleInputChange} type="text" placeholder="USER NAME" required className="w-full bg-transparent border-b border-[#333] py-3 outline-none transition-colors text-xs tracking-widest uppercase" />
            <input name="name" onChange={handleInputChange} type="text" placeholder="FULL NAME" required className="w-full bg-transparent border-b border-[#333] py-3 outline-none transition-colors text-xs tracking-widest uppercase" />
            <input name="email" onChange={handleInputChange} type="email" placeholder="EMAIL ADDRESS" required className="w-full bg-transparent border-b border-[#333] py-3 outline-none transition-colors text-xs tracking-widest uppercase" />
            <input name="password" onChange={handleInputChange} type="password" placeholder="PASSWORD" required className="w-full bg-transparent border-b border-[#333] py-3 outline-none transition-colors text-xs tracking-widest uppercase" />
            <input name="confirmPassword" onChange={handleInputChange} type="password" placeholder="RE-ENTER PASSWORD" required className="w-full bg-transparent border-b border-[#333] py-3 outline-none transition-colors text-xs tracking-widest uppercase" />
            <button type="submit" className="w-full py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-bold mt-8">Proceed to Setup</button>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-xs opacity-50 mb-4 uppercase tracking-tighter">Set monthly limits[cite: 132].</p>
            {Object.keys(budgets).map(cat => (
              <div key={cat} className="flex items-center justify-between border-b border-[#1a1a1a] py-2">
                <span className="text-xs tracking-widest uppercase">{cat}</span>
                <input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-transparent text-right outline-none w-24 text-xs"
                    onChange={(e) => setBudgets({...budgets, [cat]: e.target.value})}
                />
              </div>
            ))}
            <button onClick={handleFinalizeAccount} className="w-full py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-bold mt-8">Finalize Account</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAccount;