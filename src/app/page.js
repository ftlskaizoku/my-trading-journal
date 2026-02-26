"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Trash2, LogOut, Plus, X, Filter, BarChart3, Calculator, Image as ImageIcon, Loader2, Clock, TrendingUp } from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // --- STATE ---
  const [strategyFilter, setStrategyFilter] = useState('All');
  const [trades, setTrades] = useState([]);
  
  // Risk Calculator State
  const [calc, setCalc] = useState({ balance: '10000', riskPct: '1', entry: '', stop: '' });
  const [posSize, setPosSize] = useState(0);

  // Main Form State (Now includes image_url)
  const [form, setForm] = useState({ 
    symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY',
    entry_price: '', exit_price: '', risk_amount: '', rr_ratio: '0.00',
    entry_time: '', exit_time: '', image_url: ''
  });

  // --- AUTH & INIT ---
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

  // --- IMAGE UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trade-screenshots')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('trade-screenshots')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- CALCULATOR LOGIC ---
  useEffect(() => {
    const riskAmt = (parseFloat(calc.balance) * (parseFloat(calc.riskPct) / 100));
    const distance = Math.abs(parseFloat(calc.entry) - parseFloat(calc.stop));
    if (distance > 0) {
      setPosSize((riskAmt / distance).toFixed(2));
    }
  }, [calc]);

  // --- AUTO-CALCULATE R:R ---
  useEffect(() => {
    const pnlValue = parseFloat(form.pnl);
    const riskValue = parseFloat(form.risk_amount);
    if (!isNaN(pnlValue) && !isNaN(riskValue) && riskValue !== 0) {
      setForm(prev => ({ ...prev, rr_ratio: (pnlValue / riskValue).toFixed(2) }));
    }
  }, [form.pnl, form.risk_amount]);

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*').order('created_at', { ascending: true });
    if (data) setTrades(data);
  };

  const existingStrategies = useMemo(() => {
    const strats = trades.map(t => t.strategy).filter(Boolean);
    return [...new Set(strats)];
  }, [trades]);

  const filteredTrades = useMemo(() => {
    if (strategyFilter === 'All') return trades;
    return trades.filter(t => t.strategy === strategyFilter);
  }, [trades, strategyFilter]);

  const uniqueFilterOptions = ['All', ...existingStrategies];

  // --- ANALYTICS ---
  const totalPnL = filteredTrades.reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0);
  const winRate = filteredTrades.length > 0 ? ((filteredTrades.filter(t => t.pnl > 0).length / filteredTrades.length) * 100).toFixed(1) : 0;
  
  const chartData = filteredTrades.map((t, i) => ({
    name: `T${i + 1}`,
    pnl: filteredTrades.slice(0, i + 1).reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0)
  }));

  const strategyPieData = existingStrategies.map(strat => ({
    name: strat,
    value: trades.filter(t => t.strategy === strat).length
  }));

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
      setForm({ symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY', entry_price: '', exit_price: '', risk_amount: '', rr_ratio: '0.00', entry_time: '', exit_time: '', image_url: '' });
      setIsModalOpen(false);
      fetchTrades();
    }
  };

  const deleteTrade = async (id) => {
    const { error } = await supabase.from('trades').delete().eq('id', id);
    if (!error) fetchTrades();
  };

  const applyCalcToForm = () => {
    const riskAmt = (parseFloat(calc.balance) * (parseFloat(calc.riskPct) / 100)).toFixed(2);
    setForm(prev => ({ ...prev, entry_price: calc.entry, risk_amount: riskAmt }));
  };

  if (!hasMounted) return null;
  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{...cardStyle, maxWidth: '400px', margin: '100px auto'}}>
          <h2 className="text-center text-xl font-bold mb-4 text-white uppercase tracking-widest">TradeZella Pro</h2>
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
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h1>
                <p className="text-sm text-gray-500 font-medium">Performance Metrics</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <Filter size={16} className="text-gray-400 ml-2" />
              <select value={strategyFilter} onChange={(e) => setStrategyFilter(e.target.value)} className="bg-transparent text-xs font-bold uppercase outline-none cursor-pointer pr-4">
                {uniqueFilterOptions.map(strat => <option key={strat} value={strat}>{strat} View</option>)}
              </select>
            </div>

            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors uppercase">
                <LogOut size={16} /> Logout
            </button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Net P&L</h3>
            <p className={`text-3xl font-black mt-1 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-blue-600">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Win Rate</h3>
            <p className="text-3xl font-black mt-1">{winRate}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Trade Count</h3>
            <p className="text-3xl font-black mt-1 text-gray-900">{filteredTrades.length}</p>
          </div>
        </div>

        {/* --- CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 h-80 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart3 size={12}/> Equity Curve</h3>
            <ResponsiveContainer width="100%" height="85%"><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" /><XAxis dataKey="name" hide /><YAxis fontSize={10} tickLine={false} axisLine={false} /><Tooltip /><Area type="monotone" dataKey="pnl" stroke="#3b82f6" fill="#3b82f610" strokeWidth={3} /></AreaChart></ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-80 flex flex-col items-center shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Strategy Mix</h3>
            <div className="w-full h-full"><ResponsiveContainer><PieChart><Pie data={strategyPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{strategyPieData.map((_, i) => <Cell key={i} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i % 5]} cornerRadius={4} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
        </div>

        {/* --- TRADES TABLE --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-24">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-gray-400 border-b bg-gray-50/50">
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Execution</th>
                  <th className="px-6 py-4">Price/Time</th>
                  <th className="px-6 py-4">Risk/RR</th>
                  <th className="px-6 py-4">P&L</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-blue-50/10 transition-colors group">
                      <td className="px-6 py-4">
                        {trade.image_url ? (
                          <img src={trade.image_url} className="w-12 h-8 object-cover rounded shadow-sm hover:scale-150 transition-transform cursor-pointer" alt="Chart" />
                        ) : (
                          <div className="w-12 h-8 bg-gray-50 rounded flex items-center justify-center text-gray-200"><ImageIcon size={14}/></div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-gray-900">{trade.symbol}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase">{new Date(trade.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trade.direction === 'BUY' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>{trade.direction}</span>
                        <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">{trade.strategy}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="font-medium text-xs">${trade.entry_price} → ${trade.exit_price}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase">{trade.entry_time || '--'} - {trade.exit_time || '--'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-red-400">-${trade.risk_amount}</div>
                        <div className="text-blue-500 font-black text-xs italic">{trade.rr_ratio}R</div>
                      </td>
                      <td className={`px-6 py-4 font-black ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{trade.pnl >= 0 ? '+' : ''}${trade.pnl}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => deleteTrade(trade.id)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button></td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- FAB --- */}
        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 z-40 transition-transform active:scale-90"><Plus size={28} /></button>

        {/* --- MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
              <div className="bg-gray-900 p-6 flex justify-between items-center text-white sticky top-0 z-10">
                <h2 className="font-black text-sm uppercase flex items-center gap-2"><TrendingUp size={16}/> New Position</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Side: Upload & Calc */}
                <div className="md:col-span-5 space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Screenshot</label>
                    <div className="relative group">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="chart-upload" />
                      <label htmlFor="chart-upload" className="w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden bg-gray-50">
                        {uploading ? (
                          <Loader2 className="animate-spin text-blue-600" />
                        ) : form.image_url ? (
                          <img src={form.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <ImageIcon className="text-gray-300 mb-2" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Click to upload chart</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Calculator */}
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                    <h3 className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-widest">Position Sizer</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[9px] font-bold text-gray-400 uppercase">Balance</label><input type="number" className="w-full bg-white border border-blue-100 p-2 rounded-lg font-bold text-xs" value={calc.balance} onChange={e => setCalc({...calc, balance: e.target.value})} /></div>
                      <div><label className="text-[9px] font-bold text-gray-400 uppercase">Risk %</label><input type="number" className="w-full bg-white border border-blue-100 p-2 rounded-lg font-bold text-xs" value={calc.riskPct} onChange={e => setCalc({...calc, riskPct: e.target.value})} /></div>
                      <div><label className="text-[9px] font-bold text-gray-400 uppercase">Entry</label><input type="number" className="w-full bg-white border border-blue-100 p-2 rounded-lg font-bold text-xs" value={calc.entry} onChange={e => setCalc({...calc, entry: e.target.value})} /></div>
                      <div><label className="text-[9px] font-bold text-gray-400 uppercase">Stop</label><input type="number" className="w-full bg-white border border-blue-100 p-2 rounded-lg font-bold text-xs" value={calc.stop} onChange={e => setCalc({...calc, stop: e.target.value})} /></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-4">
                      <p className="text-lg font-black text-blue-700">{posSize} <span className="text-[10px] uppercase">Units</span></p>
                      <button onClick={applyCalcToForm} className="bg-blue-600 text-white text-[9px] font-black px-3 py-2 rounded-lg uppercase hover:bg-blue-700">Apply</button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Log Details */}
                <div className="md:col-span-7 grid grid-cols-2 gap-4">
                  <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase">Symbol</label><input placeholder="BTCUSDT" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} /></div>
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Strategy</label>
                    <input placeholder="Setup Name..." className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black mb-2" value={form.strategy} onChange={e => setForm({...form, strategy: e.target.value})} />
                    <div className="flex flex-wrap gap-1.5">{existingStrategies.map(strat => (<button key={strat} type="button" onClick={() => setForm({...form, strategy: strat})} className={`text-[8px] font-bold px-2 py-1 rounded-full border ${form.strategy === strat ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-500'}`}>{strat}</button>))}</div>
                  </div>
                  <div><label className="text-[10px] font-black text-gray-400 uppercase">Side</label><select className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.direction} onChange={e => setForm({...form, direction: e.target.value})}><option value="BUY">BUY</option><option value="SELL">SELL</option></select></div>
                  <div><label className="text-[10px] font-black text-gray-400 uppercase">Net P&L ($)</label><input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.pnl} onChange={e => setForm({...form, pnl: e.target.value})} /></div>
                  <div className="col-span-2 border-t border-gray-50 my-2"></div>
                  <div><label className="text-[10px] font-black text-gray-400 uppercase">Entry Price</label><input type="number" step="any" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.entry_price} onChange={e => setForm({...form, entry_price: e.target.value})} /></div>
                  <div><label className="text-[10px] font-black text-gray-400 uppercase">Exit Price</label><input type="number" step="any" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.exit_price} onChange={e => setForm({...form, exit_price: e.target.value})} /></div>
                  <div><label className="text-[10px] font-black text-gray-400 uppercase">Risk ($)</label><input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.risk_amount} onChange={e => setForm({...form, risk_amount: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] font-black text-gray-400 uppercase italic">Entry Time</label><input type="time" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.entry_time} onChange={e => setForm({...form, entry_time: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black text-gray-400 uppercase italic">Exit Time</label><input type="time" className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-black" value={form.exit_time} onChange={e => setForm({...form, exit_time: e.target.value})} /></div>
                  </div>
                  <div className="col-span-2 pt-6">
                    <button onClick={handleAddTrade} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">Save Trade</button>
                    <p className="text-center mt-3 text-[10px] font-bold text-gray-400 uppercase">Calculated R/R: <span className="text-blue-600">{form.rr_ratio}R</span></p>
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

// --- AUTH STYLES ---
const containerStyle = { padding: '40px', backgroundColor: '#0f172a', minHeight: '100vh' };
const cardStyle = { background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' };
const inputStyle = { padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', marginBottom: '10px', width: '100%' };
const btnStyle = { padding: '12px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', width: '100%', cursor: 'pointer' };