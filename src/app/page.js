"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
  Trash2, LogOut, Plus, X, Filter, BarChart3, Calculator, 
  Image as ImageIcon, Loader2, TrendingUp, BookOpen, Search, 
  Calendar as CalIcon, LayoutDashboard, List, Award
} from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [calc, setCalc] = useState({ balance: '10000', riskPct: '1', entry: '', stop: '' });
  const [form, setForm] = useState({ 
    symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY',
    entry_price: '', exit_price: '', risk_amount: '', rr_ratio: '0.00',
    image_url: '', notes: '', grade: 'A', trade_date: new Date().toISOString().split('T')[0]
  });

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

  useEffect(() => { if (user) fetchTrades(); }, [user]);

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*').order('trade_date', { ascending: true });
    if (data) setTrades(data);
  };

  const stats = useMemo(() => {
    const totalPnL = trades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
    const winRate = trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : 0;
    const dayMap = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0 };
    trades.forEach(t => {
      const day = new Date(t.trade_date).toLocaleDateString('en-US', { weekday: 'short' });
      if (dayMap[day] !== undefined) dayMap[day] += Number(t.pnl);
    });
    const heatmapData = Object.keys(dayMap).map(day => ({ name: day, pnl: dayMap[day] }));
    const stratStats = {};
    trades.forEach(t => {
      if (!stratStats[t.strategy]) stratStats[t.strategy] = { name: t.strategy, pnl: 0, count: 0, wins: 0 };
      stratStats[t.strategy].pnl += Number(t.pnl);
      stratStats[t.strategy].count += 1;
      if (t.pnl > 0) stratStats[t.strategy].wins += 1;
    });
    return { 
      totalPnL, 
      winRate, 
      heatmapData, 
      leaderboard: Object.values(stratStats).sort((a, b) => b.pnl - a.pnl) 
    };
  }, [trades]);

  const chartData = trades.map((t, i) => ({
    name: t.trade_date,
    pnl: trades.slice(0, i + 1).reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0)
  }));

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      const filePath = `${user.id}/${Math.random()}.${file.name.split('.').pop()}`;
      await supabase.storage.from('trade-screenshots').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('trade-screenshots').getPublicUrl(filePath);
      setForm(prev => ({ ...prev, image_url: publicUrl }));
    } finally {
      setUploading(false);
    }
  };

  const handleAddTrade = async () => {
    const { error } = await supabase.from('trades').insert([{ ...form, user_id: user.id }]);
    if (!error) { 
      setIsModalOpen(false); 
      setForm({ ...form, symbol: '', pnl: '', image_url: '', notes: '' });
      fetchTrades(); 
    }
  };

  const deleteTrade = async (id) => {
    if(confirm("Delete this entry?")) {
      await supabase.from('trades').delete().eq('id', id);
      fetchTrades();
    }
  };

  if (!hasMounted) return null;

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 w-full max-w-md shadow-2xl text-center">
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-8 italic">TRADESYLLA</h2>
        <input placeholder="Email" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white mb-3 outline-none focus:border-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white mb-8 outline-none focus:border-blue-500" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={() => supabase.auth.signInWithPassword({email, password})} className="w-full bg-blue-600 p-4 rounded-2xl font-black text-white hover:bg-blue-500 transition-all uppercase tracking-widest shadow-lg shadow-blue-900/20">Login</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-slate-900">
      {/* --- NAVIGATION --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <h1 className="font-black text-2xl tracking-tighter text-slate-900 italic">TRADESYLLA</h1>
          <div className="hidden md:flex gap-2 bg-slate-100/50 p-1.5 rounded-2xl border">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><LayoutDashboard size={14}/> Dashboard</button>
            <button onClick={() => setActiveTab('log')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'log' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={14}/> Trade Log</button>
            <button onClick={() => setActiveTab('calendar')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><CalIcon size={14}/> Calendar</button>
          </div>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-slate-300 hover:text-red-500 transition-colors font-bold uppercase text-[10px] flex items-center gap-2 tracking-widest">Logout <LogOut size={16}/></button>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={60}/></div>
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Total Net P&L</p>
                <p className="text-4xl font-black mt-2 italic">${stats.totalPnL.toFixed(2)}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Win Rate</p>
                <p className="text-4xl font-black text-blue-600 mt-2">{stats.winRate}%</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Executed</p>
                <p className="text-4xl font-black text-slate-900 mt-2">{trades.length}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Best Setup</p>
                <p className="text-xl font-black text-slate-900 mt-4 uppercase tracking-tighter">{stats.leaderboard[0]?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm h-[400px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8">Growth Curve</h3>
                <ResponsiveContainer width="100%" height="80%"><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" hide /><YAxis fontSize={10} axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="pnl" stroke="#2563eb" fill="#3b82f608" strokeWidth={4} /></AreaChart></ResponsiveContainer>
              </div>
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm h-[400px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8">Profit Heatmap (Days)</h3>
                <ResponsiveContainer width="100%" height="80%"><BarChart data={stats.heatmapData}><XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} fontWeight="900" /><Tooltip cursor={{fill: 'transparent'}} /><Bar dataKey="pnl" radius={[10, 10, 0, 0]}>{stats.heatmapData.map((entry, i) => <Cell key={i} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />)}</Bar></BarChart></ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- TRADE LOG VIEW --- */}
        {activeTab === 'log' && (
           <div className="space-y-4 animate-in slide-in-from-bottom-4">
             {[...trades].reverse().map(trade => (
               <div key={trade.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-8 group hover:border-blue-200 transition-all shadow-sm">
                 <div onClick={() => setSelectedImage(trade.image_url)} className="w-32 h-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 cursor-zoom-in border border-slate-100 relative group">
                   {trade.image_url ? <img src={trade.image_url} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={24}/></div>}
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Search className="text-white" size={20}/></div>
                 </div>
                 <div className="flex-1 grid grid-cols-4 gap-4">
                   <div><p className="text-[9px] font-black text-slate-300 uppercase">Symbol</p><p className="font-black text-lg">{trade.symbol}</p></div>
                   <div><p className="text-[9px] font-black text-slate-300 uppercase">Setup</p><p className="font-bold text-sm text-slate-500">{trade.strategy}</p></div>
                   <div><p className="text-[9px] font-black text-slate-300 uppercase">Grade</p><span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black">{trade.grade}</span></div>
                   <div className="text-right flex flex-col items-end">
                     <p className="text-[9px] font-black text-slate-300 uppercase">P&L</p>
                     <p className={`font-black text-lg ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>${trade.pnl}</p>
                     <button onClick={() => deleteTrade(trade.id)} className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mt-1"><Trash2 size={14}/></button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        )}

        {/* --- CALENDAR VIEW --- */}
        {activeTab === 'calendar' && (
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm animate-in zoom-in-95">
             <div className="grid grid-cols-7 gap-4">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase mb-4 tracking-widest">{d}</div>)}
                {Array.from({length: 31}).map((_, i) => {
                  const dayPnL = trades.filter(t => new Date(t.trade_date).getDate() === (i + 1)).reduce((acc, t) => acc + Number(t.pnl), 0);
                  return (
                    <div key={i} className={`h-28 rounded-3xl border-2 flex flex-col p-4 transition-all ${dayPnL > 0 ? 'bg-green-50/50 border-green-100' : dayPnL < 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50/30 border-slate-100'}`}>
                      <span className="text-xs font-black text-slate-400">{i + 1}</span>
                      {dayPnL !== 0 && <span className={`mt-auto text-xs font-black italic ${dayPnL > 0 ? 'text-green-600' : 'text-rose-600'}`}>${dayPnL.toFixed(0)}</span>}
                    </div>
                  );
                })}
             </div>
           </div>
        )}
      </div>

      {/* --- ADD BUTTON --- */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"><Plus size={32}/></button>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[56px] w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-lg font-black uppercase italic tracking-tighter text-slate-900">NEW JOURNAL ENTRY</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-black transition-colors"><X size={24}/></button>
            </div>
            <div className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4 space-y-8">
                <div className="h-56 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all flex flex-col items-center justify-center relative overflow-hidden">
                  <input type="file" onChange={handleFileUpload} className="hidden" id="modal-upload" />
                  <label htmlFor="modal-upload" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center">
                    {uploading ? <Loader2 className="animate-spin text-blue-500"/> : form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" /> : <><ImageIcon className="text-slate-300 mb-3" size={32}/><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Attach Chart</span></>}
                  </label>
                </div>
                <div className="bg-slate-900 p-8 rounded-[40px] text-white">
                    <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest flex gap-2"><Calculator size={12}/> Calculator</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input placeholder="Entry" className="bg-slate-800 p-3 rounded-2xl text-xs font-bold border-none" value={calc.entry} onChange={e => setCalc({...calc, entry: e.target.value})}/>
                        <input placeholder="Stop" className="bg-slate-800 p-3 rounded-2xl text-xs font-bold border-none" value={calc.stop} onChange={e => setCalc({...calc, stop: e.target.value})}/>
                    </div>
                    <button onClick={() => setForm({...form, entry_price: calc.entry})} className="w-full bg-blue-600 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Apply Price</button>
                </div>
              </div>
              <div className="md:col-span-8 grid grid-cols-2 gap-8">
                <div className="col-span-1"><label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Ticker</label><input className="w-full border-b-2 p-3 font-black text-2xl outline-none italic uppercase" placeholder="EURUSD" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})}/></div>
                <div className="col-span-1"><label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Date</label><input type="date" className="w-full border-b-2 p-3 font-black outline-none" value={form.trade_date} onChange={e => setForm({...form, trade_date: e.target.value})}/></div>
                <div className="col-span-1"><label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Net Profit ($)</label><input type="number" className="w-full border-b-2 p-3 font-black text-2xl outline-none text-blue-600 italic" placeholder="0.00" value={form.pnl} onChange={e => setForm({...form, pnl: e.target.value})}/></div>
                <div className="col-span-1"><label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Setup Name</label><input className="w-full border-b-2 p-3 font-black text-2xl outline-none italic" placeholder="Breakout" value={form.strategy} onChange={e => setForm({...form, strategy: e.target.value})}/></div>
                <div className="col-span-2"><label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Journal Notes</label><textarea className="w-full border-2 border-slate-100 p-4 rounded-3xl text-sm mt-2 outline-none h-24" placeholder="How did you feel? Why did you enter?" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea></div>
                <div className="col-span-2 pt-4"><button onClick={handleAddTrade} className="w-full bg-slate-900 text-white p-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs hover:bg-black transition-all shadow-2xl">Finalize Log</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX --- */}
      {selectedImage && (
        <div className="fixed inset-0 bg-slate-950/98 z-[100] p-12 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl" />
          <button className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform"><X size={48}/></button>
        </div>
      )}
    </main>
  );
}