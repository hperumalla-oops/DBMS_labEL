
// const COLORS = {
//   Food: '#22c55e',     // green
//   Travel: '#3b82f6',   // blue
//   Rent: '#ef4444',     // red
//   Games: '#a855f7',    // purple
// };


// import React, { useState, useEffect } from 'react';
// import API from '../api';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// const Dashboard = () => {
//   const [budgets, setBudgets] = useState([]);
//   const [expense, setExpense] = useState({
//     amount: '',
//     catid: '',
//     note: ''
//   });
//   const [month, setMonth] = useState('2024-12');


//   const userid = localStorage.getItem('userid');

//   // Fetch dashboard data
//   const fetchDashboard = async () => {
//     try {
//       const res = await API.get(`/dashboard/${userid}`);
//       setBudgets(res.data);
//     } catch (err) {
//       console.error('Dashboard fetch failed', err);
//     }
//   };
//   const handleLogout = () => {
//   localStorage.removeItem('userid');
//   localStorage.removeItem('userName');
//   window.location.href = '/login';
// };


//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   // Auto-select first category
//   useEffect(() => {
//     if (budgets.length && !expense.catid) {
//       setExpense(e => ({
//         ...e,
//         catid: budgets[0].categoryid
//       }));
//     }
//   }, [budgets]);

//   const handleAddExpense = async () => {
//     if (!expense.amount || !expense.catid) return;

//     try {
//       await API.post('/add-expense', {
//         userid,
//         amount: Number(expense.amount),
//         catid: expense.catid,
//         note: expense.note
//       });

//       setExpense({ amount: '', catid: '', note: '' });
//       fetchDashboard();
//     } catch (err) {
//       console.error('Add expense failed', err);
//     }
//   };

//   return (
    
//     <div className="min-h-screen bg-black text-white p-10 font-sans">
//       <h1 className="text-4xl font-light tracking-tighter mb-10">
//         Financial Overview.
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

//         {/* LEFT — Add Transaction */}
//         <div className="border border-[#1a1a1a] p-8 bg-[#050505]">
//           <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6">
//             New Transaction
//           </h2>

//           <div className="space-y-6">
//             <input
//               type="number"
//               placeholder="AMOUNT"
//               value={expense.amount}
//               onChange={(e) =>
//                 setExpense({ ...expense, amount: e.target.value })
//               }
//               className="w-full bg-transparent border-b border-[#333] py-2 outline-none focus:border-white"
//             />

//             <select
//               value={expense.catid}
//               onChange={(e) =>
//                 setExpense({ ...expense, catid: e.target.value })
//               }
//               className="w-full bg-black border-b border-[#333] py-2 outline-none uppercase text-xs"
//             >
//               {budgets.map(b => (
//                 <option key={b.categoryid} value={b.categoryid}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               placeholder="NOTE"
//               value={expense.note}
//               onChange={(e) =>
//                 setExpense({ ...expense, note: e.target.value })
//               }
//               className="w-full bg-transparent border-b border-[#333] py-2 outline-none"
//             />

//             <button
//               onClick={handleAddExpense}
//               className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest"
//             >
//               Add Transaction
//             </button>
//           </div>
//         </div>
//                 <div className="flex justify-between items-center mb-10">
//         <h1 className="text-4xl font-light tracking-tighter">
//             Financial Overview.
//         </h1>

//         <button
//             onClick={handleLogout}
//             className="text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition"
//         >
//             Logout
//         </button>
//         </div>

//         {/* RIGHT — Analytics */}
//         <div className="space-y-10">

//           <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">
//             Budget Allocation
//           </h2>

//           {budgets.length === 0 && (
//             <p className="text-xs opacity-40 uppercase tracking-widest">
//               No budgets yet.
//             </p>
//           )}

//           {budgets.map(b => {
//             const percent = Math.min(
//               (b.amount_spent / b.limit_amount) * 100,
//               100
//             );

//             return (
//               <div key={b.categoryid} className="space-y-2">
//                 <div className="flex justify-between text-[10px] tracking-widest uppercase">
//                   <span>{b.name}</span>
//                   <span className={percent > 80 ? 'text-red-500' : 'opacity-60'}>
//                     {b.amount_spent} / {b.limit_amount}
//                   </span>
//                 </div>

//                 <div
//                     className="h-full transition-all duration-500"
//                     style={{
//                         width: `${percent}%`,
//                         backgroundColor: COLORS[b.name] || '#ffffff'
//                     }}
//                     />


//                 {percent > 80 && (
//                   <p className="text-[8px] text-red-500 uppercase tracking-tighter italic">
//                     Warning: Nearing limit
//                   </p>
//                 )}
//               </div>
//             );
//           })}

//           {/* PIE CHART */}
//           {budgets.length > 0 && (
//             <div>
//               <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4">
//                 Spending Distribution
//               </h2>

//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={budgets}
//                       dataKey="amount_spent"
//                       nameKey="name"
//                       innerRadius={60}
//                       outerRadius={90}
//                     >
//                       {budgets.map((b, i) => (
//                         <Cell
//                             key={b.categoryid}
//                             fill={COLORS[b.name] || '#8884d8'}
//                         />
//                         ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import API from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  Food: '#22c55e',
  Travel: '#3b82f6',
  Rent: '#ef4444',
  Games: '#a855f7',
};

const Dashboard = () => {
  const userid = localStorage.getItem('userid');

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [budgets, setBudgets] = useState([]);
  const [expense, setExpense] = useState({
    amount: '',
    catid: '',
    note: '',
  });

  // Fetch dashboard data for selected month
  const fetchDashboard = async () => {
    try {
      const res = await API.get(`/dashboard/${userid}/${month}`);
      setBudgets(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [month]);

  // Auto-select first category
  useEffect(() => {
    if (budgets.length && !expense.catid) {
      setExpense(e => ({ ...e, catid: budgets[0].categoryid }));
    }
  }, [budgets]);

  const handleAddExpense = async () => {
    if (!expense.amount || !expense.catid) return;

    await API.post('/add-expense', {
      userid,
      catid: expense.catid,
      amount: Number(expense.amount),
      note: expense.note,
    });

    setExpense({ amount: '', catid: '', note: '' });
    fetchDashboard();
  };

  const handleNewMonth = async () => {
    await API.post('/new-budget', {
      userid,
      month,
    });
    fetchDashboard();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-light tracking-tighter">
            Financial Overview.
          </h1>
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            {month}
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-black border-b border-[#333] text-xs uppercase outline-none"
          />

          <button
            onClick={handleNewMonth}
            className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            New Month
          </button>

          <button
            onClick={handleLogout}
            className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT — ADD EXPENSE */}
        <div className="border border-[#1a1a1a] p-8 bg-[#050505]">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6">
            New Transaction
          </h2>

          <div className="space-y-6">
            <input
              type="number"
              placeholder="AMOUNT"
              value={expense.amount}
              onChange={(e) =>
                setExpense({ ...expense, amount: e.target.value })
              }
              className="w-full bg-transparent border-b border-[#333] py-2 outline-none"
            />

            <select
              value={expense.catid}
              onChange={(e) =>
                setExpense({ ...expense, catid: e.target.value })
              }
              className="w-full bg-black border-b border-[#333] py-2 outline-none uppercase text-xs"
            >
              {budgets.map(b => (
                <option key={b.categoryid} value={b.categoryid}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="NOTE"
              value={expense.note}
              onChange={(e) =>
                setExpense({ ...expense, note: e.target.value })
              }
              className="w-full bg-transparent border-b border-[#333] py-2 outline-none"
            />

            <button
              onClick={handleAddExpense}
              className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* RIGHT — ANALYTICS */}
        <div className="space-y-10">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">
            Budget Allocation
          </h2>

          {budgets.length === 0 && (
            <p className="text-xs opacity-40 uppercase tracking-widest">
              No budget for this month.
            </p>
          )}

          {budgets.map(b => {
            const percent = Math.min(
              (b.amount_spent / b.limit_amount) * 100,
              100
            );

            return (
              <div key={b.categoryid} className="space-y-2">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span>{b.name}</span>
                  <span>
                    {b.amount_spent} / {b.limit_amount}
                  </span>
                </div>

                <div className="h-[2px] w-full bg-[#111]">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: COLORS[b.name] || '#fff',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {budgets.length > 0 && (
            <div>
              <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-4">
                Spending Distribution
              </h2>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgets}
                      dataKey="amount_spent"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                    >
                      {budgets.map(b => (
                        <Cell
                          key={b.categoryid}
                          fill={COLORS[b.name] || '#888'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
