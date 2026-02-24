"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { PlusCircle, LayoutDashboard, DollarSign, Activity, Trash2, LogOut } from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ symbol: '', pnl: '', strategy: 'Trend' });

  // 1. AUTHENTICATION LOGIC
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

  // 2. DATA FETCHING LOGIC
  useEffect(() => {
    if (user) fetchTrades();
  }, [user]);

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*').order('created_at', { ascending: true });
    if (data) setTrades(data);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for confirmation!");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTrades([]); // Clear trades on logout
  };

  const handleAddTrade = async (e) => {
    e.preventDefault();
    if (!form.symbol || !form.pnl) return;
    const { error } = await supabase.from('trades').insert([{ 
      symbol: form.symbol.toUpperCase(), 
      pnl: parseFloat(form.pnl),
      strategy: form.strategy,
      user_id: user.id // Links trade to this specific user
    }]);
    if (!error) {
      setForm({ ...form, symbol: '', pnl: '' });
      fetchTrades();
    }
  };

  const deleteTrade = async (id) => {
    const { error } = await supabase.from('trades').delete().eq('id', id);
    if (!error) fetchTrades();
  };

  // --- ANALYTICS ---
  const totalPnL = trades.reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0);
  const wins = trades.filter(t => Number(t.pnl) > 0).length;
  const losses = trades.filter(t => Number(t.pnl) <= 0).length;
  const pieData = [{ name: 'Wins', value: wins }, { name: 'Losses', value: losses }];
  const COLORS = ['#4ade80', '#f87171'];

  if (!hasMounted) return null;

  // --- SHOW LOGIN IF NO USER ---
  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{...cardStyle, maxWidth: '400px', margin: '100px auto'}}>
          <h2 style={{textAlign: 'center'}}>TradeZella Pro</h2>
          <p style={{textAlign: 'center', color: '#94a3b8', marginBottom: '20px'}}>Sign in to view your journal</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <input placeholder="Email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignIn} style={btnStyle}>Login</button>
            <button onClick={handleSignUp} style={{...btnStyle, background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8'}}>Create Account</button>
          </div>
        </div>
      </div>
    );
  }

  // --- SHOW DASHBOARD IF USER EXISTS ---
  return (
    <div style={containerStyle}>
      <header style={{...headerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={32} color="#38bdf8" />
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>TradeZella Pro</h1>
        </div>
        <button onClick={handleSignOut} style={{...btnStyle, background: '#f87171', color: 'white', padding: '8px 16px'}}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div style={statsGridStyle}>
        <div style={cardStyle}>
          <p style={labelStyle}><DollarSign size={16} /> Net PnL</p>
          <h2 style={{ ...valueStyle, color: totalPnL >= 0 ? '#4ade80' : '#f87171' }}>${totalPnL.toFixed(2)}</h2>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}><Activity size={16} /> Win/Loss Ratio</p>
          <div style={{ height: '80px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddTrade} style={formStyle}>
        <input placeholder="Symbol" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} style={inputStyle} />
        <input placeholder="PnL ($)" type="number" value={form.pnl} onChange={e => setForm({...form, pnl: e.target.value})} style={inputStyle} />
        <select value={form.strategy} onChange={e => setForm({...form, strategy: e.target.value})} style={inputStyle}>
          <option value="Trend">Trend Following</option>
          <option value="Scalp">Scalp</option>
          <option value="Breakout">Breakout</option>
        </select>
        <button type="submit" style={btnStyle}><PlusCircle size={18} /> Log</button>
      </form>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '10px' }}>Trade</th>
              <th>Strategy</th>
              <th>PnL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '15px 10px' }}>
                    <b>{t.symbol}</b><br/>
                    <small style={{color: '#64748b'}}>{new Date(t.created_at).toLocaleDateString()}</small>
                </td>
                <td><span style={tagStyle}>{t.strategy || 'Manual'}</span></td>
                <td style={{ color: t.pnl >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>${t.pnl}</td>
                <td><Trash2 size={18} color="#f87171" style={{cursor: 'pointer'}} onClick={() => deleteTrade(t.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- STYLES (Keep exactly same as before) ---
const containerStyle = { padding: '40px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' };
const headerStyle = { marginBottom: '30px' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' };
const cardStyle = { background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' };
const labelStyle = { color: '#94a3b8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' };
const valueStyle = { margin: 0, fontSize: '1.8rem' };
const formStyle = { display: 'flex', gap: '10px', marginBottom: '30px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', flex: 1 };
const btnStyle = { padding: '12px 24px', borderRadius: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' };
const tagStyle = { background: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8' };