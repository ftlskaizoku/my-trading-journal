"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { PlusCircle, Trash2, LogOut, Activity, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ 
    symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY',
    entry_price: '', exit_price: '', risk_amount: '', rr_ratio: '0.00',
    entry_time: '', exit_time: ''
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    setHasMounted(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchTrades();
  }, [user]);

  // --- AUTO-CALCULATE R:R ---
  useEffect(() => {
    const pnlValue = parseFloat(form.pnl);
    const riskValue = parseFloat(form.risk_amount);
    if (!isNaN(pnlValue) && !isNaN(riskValue) && riskValue !== 0) {
      const calculated = (pnlValue / riskValue).toFixed(2);
      setForm(prev => ({ ...prev, rr_ratio: calculated }));
    }
  }, [form.pnl, form.risk_amount]);

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*').order('created_at', { ascending: true });
    if (data) setTrades(data);
  };

  const handleAddTrade = async (e) => {
    e.preventDefault();
    if (!form.symbol || !form.pnl) return alert("Enter Symbol and P&L");
    
    const { error } = await supabase.from('trades').insert([{ 
      ...form,
      symbol: form.symbol.toUpperCase(), 
      pnl: parseFloat(form.pnl),
      risk_amount: parseFloat(form.risk_amount) || 0,
      rr_ratio: parseFloat(form.rr_ratio) || 0,
      user_id: user.id 
    }]);
    
    if (!error) {
      setForm({ 
        symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY',
        entry_price: '', exit_price: '', risk_amount: '', rr_ratio: '0.00',
        entry_time: '', exit_time: '' 
      });
      setIsModalOpen(false);
      fetchTrades();
    } else {
      alert(error.message);
    }
  };

  const deleteTrade = async (id) => {
    const { error } = await supabase.from('trades').delete().eq('id', id);
    if (!error) fetchTrades();
  };

  const totalPnL = trades.reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0);
  const winRate = trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : 0;
  const chartData = trades.map((t, i) => ({
    name: `T${i + 1}`,
    pnl: trades.slice(0, i + 1).reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0)
  }));
  const strategyData = trades.reduce((acc, trade) => {
    const existing = acc.find(item => item.name === trade.strategy);
    existing ? existing.value += 1 : acc.push({ name: trade.strategy || 'Trend', value: 1 });
    return acc;
  }, []);

  const STRATEGY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (!hasMounted) return null;

  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{...cardStyle, maxWidth: '400px', margin: '100px auto'}}>
          <h2 className="text-center text-xl font-bold mb-4 text-white">TradeZella Pro</h2>
          <div className="flex flex-col gap-3">
            <input placeholder="Email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={() => supabase.auth.signInWithPassword({email, password})} style={btnStyle}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black relative"> 
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h1>
                <p className="text-sm text-gray-500 font-medium">Performance Metrics</p>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors uppercase">
                <LogOut size={16} /> Logout
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total P&L</h3>
            <p className={`text-3xl font-black mt-1 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-blue-600">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Win Rate</h3>
            <p className="text-3xl font-black mt-1">{winRate}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Trades</h3>
            <p className="text-3xl font-black mt-1 text-gray-900">{trades.length}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 h-80 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Equity Curve</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" hide />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="pnl" stroke="#3b82f6" fill="#3b82f610" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-80 flex flex-col items-center shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strategy Mix</h3>
            <div className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={strategyData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                    {strategyData.map((_, i) => <Cell key={i} fill={STRATEGY_COLORS[i % 5]} cornerRadius={4} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-gray-400 border-b bg-gray-50">
                  <th className="px-6 py-4">Day / Date</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Execution</th>
                  <th className="px-6 py-4">Entry / Exit</th>
                  <th className="px-6 py-4">Risk / RR</th>
                  <th className="px-6 py-4">P&L</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {trades.length === 0 ? (
                    <tr><td colSpan="7" className="p-20 text-center text-gray-300 font-medium uppercase tracking-widest text-xs">No Data Logged</td></tr>
                ) : (
                  trades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{new Date(trade.created_at).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(trade.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900 tracking-tight">{trade.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${trade.direction === 'BUY' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                          {trade.direction === 'BUY' ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {trade.direction}
                        </span>
                        <div className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{trade.strategy}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        <div>${trade.entry_price} <span className="text-gray-300 mx-1">→</span> ${trade.exit_price}</div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold">{trade.entry_time} - {trade.exit_time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-red-400">-${trade.risk_amount}</div>
                        <div className="text-blue-500 font-black text-xs italic">{trade.rr_ratio}R</div>
                      </td>
                      <td className={`px-6 py-4 font-black text-base ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteTrade(trade.id)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- FLOATING ACTION BUTTON --- */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all z-40 active:scale-90"
        >
          <Plus size={28} />
        </button>

        {/* --- UPDATED LOG MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-gray-900 p-6 flex justify-between items-center">
                <h2 className="text-white font-black tracking-tight uppercase text-sm">Log New Position</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
              </div>
              <div className="p-8 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Symbol</label>
                  <input placeholder="e.g. BTCUSDT" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none font-bold text-black" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Strategy</label>
                  <input list="modal-strategies" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none font-bold text-black" value={form.strategy} onChange={e => setForm({...form, strategy: e.target.value})} />
                  <datalist id="modal-strategies">
                    <option value="Trend" /><option value="Reversal" /><option value="Breakout" /><option value="Scalp" />
                  </datalist>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Side</label>
                  <select className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none font-bold text-black" value={form.direction} onChange={e => setForm({...form, direction: e.target.value})}>
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">P&L ($)</label>
                  <input type="number" placeholder="Net Profit/Loss" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none font-bold text-black" value={form.pnl} onChange={e => setForm({...form, pnl: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Risk ($)</label>
                  <input type="number" placeholder="Risk Amount" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-red-500 outline-none font-bold text-black" value={form.risk_amount} onChange={e => setForm({...form, risk_amount: e.target.value})} />
                </div>
                <div>
                    {/* Placeholder to keep grid aligned */}
                </div>
                <div className="border-t border-gray-50 col-span-2 my-2"></div>
                
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Entry Price</label>
                  <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.entry_price} onChange={e => setForm({...form, entry_price: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Exit Price</label>
                  <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.exit_price} onChange={e => setForm({...form, exit_price: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Entry Time</label>
                  <input type="time" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.entry_time} onChange={e => setForm({...form, entry_time: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Exit Time</label>
                  <input type="time" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.exit_time} onChange={e => setForm({...form, exit_time: e.target.value})} />
                </div>
                
                <div className="col-span-2 space-y-4 pt-4">
                  <button onClick={handleAddTrade} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                    Log Position
                  </button>
                  <div className="text-center bg-gray-50 py-2 rounded-lg">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Estimated Reward/Risk Ratio: </span>
                    <span className="text-sm font-black text-blue-600 italic">{form.rr_ratio}R</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// Styling for Auth Screens
const containerStyle = { padding: '40px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' };
const cardStyle = { background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' };
const inputStyle = { padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', marginBottom: '10px', width: '100%' };
const btnStyle = { padding: '12px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', border: 'none', width: '100%' };