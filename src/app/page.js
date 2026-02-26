"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, CartesianGrid
} from 'recharts';
import { 
  Plus, X, LayoutDashboard, List, Target, Activity, ChevronLeft, 
  PlayCircle, ShieldCheck, Menu, CheckCircle2, AlertCircle, Terminal, 
  Trash2, Filter, ArrowUpRight, ArrowDownRight, Brain, Camera, Clock, Zap, Cpu, History,
  Settings, Globe, Monitor, LogOut, User, Bell, Lock, Palette, Search, Calendar
} from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Filtering States
  const [filterStrategy, setFilterStrategy] = useState('All');
  const [filterAsset, setFilterAsset] = useState('All');
  
  // Settings States
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('Dark');
  const [aspectRatio, setAspectRatio] = useState('Full');

  // Playbook & AI States
  const [playbookRules, setPlaybookRules] = useState(['VWAP Support', 'RSI Divergence', 'Volume Confirmation']);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [aiStrategyDesc, setAiStrategyDesc] = useState('');
  const [btResults, setBtResults] = useState([]);

  // Form State
  const [form, setForm] = useState({ 
    symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY', 
    mindset: 'Neutral', mistake: 'None', exit_quality: 'Good',
    notes: '', trade_date: new Date().toISOString().split('T')[0] 
  });
  const [selectedRules, setSelectedRules] = useState([]);

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { if (user) fetchTrades(); }, [user]);

  const fetchTrades = async () => {
    const { data, error } = await supabase.from('trades').select('*').order('trade_date', { ascending: false });
    if (error) console.error("Error fetching:", error);
    if (data) setTrades(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- LOGIC ORDER FIXED: Define filteredTrades FIRST ---
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchStrat = filterStrategy === 'All' || t.strategy === filterStrategy;
      const matchAsset = filterAsset === 'All' || t.symbol === filterAsset;
      return matchStrat && matchAsset;
    });
  }, [trades, filterStrategy, filterAsset]);

  // --- Define Stats and Behavioral Analytics AFTER filteredTrades ---
  const behavioralStats = useMemo(() => {
    const mistakes = {};
    let holdEarly = 0;
    filteredTrades.forEach(t => {
      if (t.mistake && t.mistake !== 'None') mistakes[t.mistake] = (mistakes[t.mistake] || 0) + 1;
      if (t.exit_quality === 'Early') holdEarly++;
    });
    return { 
        mistakeData: Object.entries(mistakes).map(([name, value]) => ({ name, value })),
        holdEfficiency: filteredTrades.length ? Math.round(((filteredTrades.length - holdEarly) / filteredTrades.length) * 100) : 100
    };
  }, [filteredTrades]);

  const stats = useMemo(() => {
    if (!filteredTrades.length) return { totalPnL: 0, winRate: 0, syllaScore: 0, pf: '0.00' };
    const wins = filteredTrades.filter(t => Number(t.pnl) > 0);
    const totalPnL = filteredTrades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
    const winRate = ((wins.length / filteredTrades.length) * 100).toFixed(1);
    
    // Simple PF calculation: Total Gains / Absolute Total Losses
    const gains = wins.reduce((acc, t) => acc + Number(t.pnl), 0);
    const losses = Math.abs(filteredTrades.filter(t => Number(t.pnl) < 0).reduce((acc, t) => acc + Number(t.pnl), 0));
    const pf = losses === 0 ? gains.toFixed(2) : (gains / losses).toFixed(2);

    return { totalPnL, winRate, syllaScore: Math.round(winRate * 0.85), pf };
  }, [filteredTrades]);

  const runAiSimulation = () => {
    if (!aiStrategyDesc) return alert("AI requires strategy explanation to train.");
    const sim = Array.from({ length: 8 }, (_, i) => ({
      id: i, res: Math.random() > 0.4 ? 'WIN' : 'LOSS', val: Math.floor(Math.random() * 800) - 200
    }));
    setBtResults(sim);
  };

  if (!hasMounted) return null;

  return (
    <main className={`min-h-screen bg-[#07090D] text-slate-400 flex overflow-hidden font-sans ${aspectRatio === 'Compact' ? 'max-w-7xl mx-auto shadow-2xl border-x border-white/5' : ''}`}>
      
      {/* SIDEBAR */}
      {!isMobile && (
        <aside className={`fixed top-0 left-0 h-full bg-[#0F1219] border-r border-white/5 transition-all duration-300 z-[100] ${isSidebarOpen ? 'w-[240px]' : 'w-[70px]'}`}>
           <div className="h-20 flex items-center justify-center border-b border-white/5 text-white">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hover:bg-white/5 p-2 rounded-lg transition-colors">
                {isSidebarOpen ? <ChevronLeft size={20}/> : <Menu size={20}/>}
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-2 mt-8">
              <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isOpen={isSidebarOpen} />
              <SidebarItem icon={<Brain size={20}/>} label="Sylla Edge" active={activeTab === 'edge'} onClick={() => setActiveTab('edge')} isOpen={isSidebarOpen} />
              <SidebarItem icon={<ShieldCheck size={20}/>} label="Backtest" active={activeTab === 'backtest'} onClick={() => setActiveTab('backtest')} isOpen={isSidebarOpen} />
              <SidebarItem icon={<PlayCircle size={20}/>} label="Playbook" active={activeTab === 'playbook'} onClick={() => setActiveTab('playbook')} isOpen={isSidebarOpen} />
              <SidebarItem icon={<List size={20}/>} label="History" active={activeTab === 'log'} onClick={() => setActiveTab('log')} isOpen={isSidebarOpen} />
              <SidebarItem icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isOpen={isSidebarOpen} />
            </nav>
        </aside>
      )}

      {/* FLOATING QUICK LOG BUTTON */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-blue-600 text-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center z-[400] hover:scale-110 active:scale-95 transition-all border border-white/20 group">
        <Plus size={36} className="group-hover:rotate-90 transition-transform duration-500"/>
      </button>

      <div className={`flex-1 transition-all duration-300 ${!isMobile ? (isSidebarOpen ? 'ml-[240px]' : 'ml-[70px]') : 'ml-0'} p-8 pb-40`}>
        
        {/* GLOBAL FILTERS */}
        {activeTab !== 'settings' && (
          <div className="flex flex-wrap items-center gap-4 bg-[#0F1219] p-3 rounded-[24px] border border-white/5 w-fit mb-10 shadow-xl">
              <div className="flex items-center gap-3 px-4 border-r border-white/10">
                  <Filter size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis Filter</span>
              </div>
              <FilterSelect label="Strategy" value={filterStrategy} options={['All', ...new Set(trades.map(t => t.strategy))]} onChange={setFilterStrategy} />
              <FilterSelect label="Asset" value={filterAsset} options={['All', ...new Set(trades.map(t => t.symbol))]} onChange={setFilterAsset} />
          </div>
        )}

        {/* --- TAB: DASHBOARD (Full Analytics & Charts) --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-2xl">
                <p className="text-[10px] font-black uppercase opacity-70 tracking-widest relative z-10">Sylla Rating</p>
                <p className="text-5xl font-black italic mt-2 relative z-10">{stats.syllaScore}</p>
                <Zap className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
              </div>
              <StatBox label="Win Rate" value={`${stats.winRate}%`} trend="+2.1%" />
              <StatBox label="Profit Factor" value={stats.pf} color="text-blue-400" />
              <StatBox label="Net Equity" value={`$${stats.totalPnL}`} color={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-500"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px] shadow-2xl h-[450px]">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 mb-8 flex items-center gap-2"><Activity size={16} className="text-blue-500"/> Growth Trajectory</h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={filteredTrades.map((t, i) => ({ n: i, p: filteredTrades.slice(0, i+1).reduce((s, c) => s + Number(c.pnl), 0) }))}>
                            <defs>
                                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="p" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPnL)" />
                            <Tooltip contentStyle={{backgroundColor: '#0F1219', border: 'none', borderRadius: '15px'}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px] shadow-2xl h-[450px]">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 mb-8 flex items-center gap-2"><History size={16} className="text-blue-500"/> Recent P&L Density</h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={filteredTrades.slice(0, 12).reverse()}>
                            <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                                {filteredTrades.slice(0, 12).reverse().map((e, i) => <Cell key={i} fill={Number(e.pnl) >= 0 ? '#10b981' : '#f43f5e'} />)}
                            </Bar>
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0F1219', border: 'none'}} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        )}

        {/* --- TAB: SYLLA EDGE (Behavioral) --- */}
        {activeTab === 'edge' && (
          <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest underline decoration-blue-500 underline-offset-8">Holding Efficiency</h4>
                    <p className="text-6xl font-black italic text-white mt-6">{behavioralStats.holdEfficiency}%</p>
                    <p className="text-[11px] text-slate-600 mt-6 uppercase font-bold leading-relaxed">How often you stuck to your target without closing early or panicking.</p>
                </div>
                <div className="col-span-2 bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-8">Mistake Frequency</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {behavioralStats.mistakeData.length > 0 ? behavioralStats.mistakeData.map(m => (
                            <div key={m.name} className="p-6 bg-[#07090D] border border-white/5 rounded-3xl hover:border-rose-500/50 transition-colors">
                                <p className="text-rose-500 font-black italic text-2xl">{m.value}</p>
                                <p className="text-[9px] font-black uppercase text-slate-500 mt-1">{m.name}</p>
                            </div>
                        )) : <p className="text-[10px] uppercase font-black opacity-20 col-span-full">No mistakes recorded. Perfect trading.</p>}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- TAB: BACKTEST (AI Trainer) --- */}
        {activeTab === 'backtest' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in-95 duration-500">
            <div className="bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-8">
                <h3 className="text-white font-black italic uppercase text-lg flex items-center gap-2"><Cpu size={20} className="text-blue-500"/> AI Training Lab</h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Logic Description</label>
                        <textarea value={aiStrategyDesc} onChange={e => setAiStrategyDesc(e.target.value)} placeholder="Describe your edge..." className="w-full bg-[#07090D] border border-white/5 p-5 rounded-3xl text-white text-[12px] h-40 outline-none focus:border-blue-500 shadow-inner" />
                    </div>
                    <div className="p-10 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center hover:border-blue-500 group transition-all cursor-pointer">
                        <Camera className="text-slate-600 group-hover:text-blue-500 mb-3" size={32}/>
                        <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white">Upload Reference Entry</span>
                    </div>
                    <button onClick={runAiSimulation} className="w-full bg-blue-600 py-5 rounded-[24px] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20">Initialize Simulation</button>
                </div>
            </div>
            <div className="lg:col-span-2 bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative">
                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-8 italic">Neural Simulation Results</h4>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {btResults.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-[#07090D] rounded-2xl border border-white/5 border-l-4 border-l-blue-600 animate-in slide-in-from-left-4">
                            <span className="text-[11px] font-black text-white italic tracking-widest uppercase">SYLLA_SIM_EVAL_{i+1}</span>
                            <span className={`text-[12px] font-black ${r.res === 'WIN' ? 'text-emerald-500' : 'text-rose-500'}`}>{r.res} ({r.val >= 0 ? '+' : ''}${r.val})</span>
                        </div>
                    ))}
                    {!btResults.length && <div className="h-64 flex flex-col items-center justify-center opacity-10"><ShieldCheck size={60} /></div>}
                </div>
            </div>
          </div>
        )}

        {/* --- TAB: JOURNAL HISTORY (RESTORED) --- */}
        {activeTab === 'log' && (
          <div className="bg-[#0F1219] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-500">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#131720]">
                <h3 className="text-white font-black uppercase italic tracking-tighter">Verified Trade History</h3>
                <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full text-slate-400">{filteredTrades.length} Trades Logged</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#07090D] text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Symbol</th>
                            <th className="px-8 py-5">Strategy</th>
                            <th className="px-8 py-5 text-right">Net P&L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTrades.map((t, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-5 text-[11px] font-bold text-slate-400">{t.trade_date}</td>
                                <td className="px-8 py-5 text-[12px] font-black text-white italic uppercase tracking-tighter">{t.symbol}</td>
                                <td className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">{t.strategy}</td>
                                <td className={`px-8 py-5 text-right text-[12px] font-black ${Number(t.pnl) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {Number(t.pnl) >= 0 ? '+' : ''}${t.pnl}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
        )}

        {/* --- TAB: PLAYBOOK --- */}
        {activeTab === 'playbook' && (
          <div className="max-w-2xl bg-[#0F1219] border border-white/5 p-12 rounded-[50px] shadow-2xl">
            <h3 className="text-white font-black italic uppercase text-2xl mb-8 flex items-center gap-3">The Edge Playbook</h3>
            <div className="space-y-4">
              {playbookRules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#07090D] p-6 rounded-3xl border border-white/5 group transition-all">
                  <span className="text-[12px] text-white font-black uppercase italic tracking-widest">{rule}</span>
                  <button onClick={() => setPlaybookRules(playbookRules.filter((_, i) => i !== idx))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4">
              <input value={newRuleInput} onChange={e => setNewRuleInput(e.target.value)} placeholder="Add new confirmation rule..." className="flex-1 bg-[#07090D] border border-white/5 p-5 rounded-3xl text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
              <button onClick={() => { if(newRuleInput) {setPlaybookRules([...playbookRules, newRuleInput]); setNewRuleInput('');} }} className="bg-white text-black px-10 rounded-3xl font-black uppercase text-[10px] hover:bg-blue-600 hover:text-white transition-all">Add</button>
            </div>
          </div>
        )}

        {/* --- TAB: SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl animate-in slide-in-from-bottom-5 duration-500 space-y-10">
            <header><h2 className="text-4xl font-black text-white italic uppercase tracking-tighter underline decoration-blue-600 decoration-8 underline-offset-[12px]">Settings</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-[#0F1219] border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
                    <h3 className="text-white font-black uppercase text-sm flex items-center gap-3"><Globe size={18} className="text-blue-500"/> Preferences</h3>
                    <SettingToggle label="Language" value={language} options={['English', 'Spanish', 'French']} onChange={setLanguage} />
                    <SettingToggle label="Screen Layout" value={aspectRatio} options={['Full', 'Compact']} onChange={setAspectRatio} />
                </div>
                <div className="bg-[#0F1219] border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
                    <h3 className="text-white font-black uppercase text-sm flex items-center gap-3"><User size={18} className="text-blue-500"/> Account</h3>
                    <div className="p-6 bg-[#07090D] border border-white/5 rounded-3xl"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">User Identity</p><p className="text-white font-black text-xs italic">{user?.email || "Trader@Sylla.AI"}</p></div>
                    <button onClick={handleLogout} className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-6 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3"><LogOut size={16}/> End Session</button>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: MANUAL TRADE ENTRY (FULL) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-xl z-[600] flex items-center justify-center p-6">
          <div className="bg-[#0F1219] w-full max-w-2xl rounded-[50px] border border-white/10 p-12 max-h-[90vh] overflow-y-auto shadow-3xl custom-scrollbar">
             <div className="flex justify-between items-center mb-12">
                <h3 className="text-white font-black italic uppercase text-2xl underline decoration-blue-600 decoration-4 underline-offset-8">Journal Entry</h3>
                <button onClick={() => setIsModalOpen(false)} className="bg-white/5 p-3 rounded-2xl text-slate-500 hover:text-white"><X/></button>
             </div>
             <div className="grid grid-cols-2 gap-8 mb-8">
                <ModalInput label="Asset/Pair" value={form.symbol} onChange={v => setForm({...form, symbol: v})} />
                <ModalInput label="Net P&L ($)" value={form.pnl} onChange={v => setForm({...form, pnl: v})} />
             </div>
             <div className="grid grid-cols-2 gap-8 mb-8">
                <ModalSelect label="Psychology" options={['Neutral', 'Focused', 'Greedy', 'Anxious']} onChange={v => setForm({...form, mindset: v})} />
                <ModalSelect label="Exec. Quality" options={['Perfect', 'Early Exit', 'Late Entry', 'Chased']} onChange={v => setForm({...form, mistake: v})} />
             </div>
             <div className="mb-10 p-10 bg-[#07090D] rounded-[40px] border border-white/5 shadow-inner">
                <p className="text-[10px] font-black uppercase text-slate-600 mb-8 text-center tracking-widest italic">Playbook Checklist</p>
                <div className="grid grid-cols-1 gap-3">
                    {playbookRules.map(rule => (
                        <button key={rule} onClick={() => setSelectedRules(prev => prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule])} className={`text-left p-5 rounded-2xl border text-[11px] font-black uppercase flex justify-between items-center transition-all ${selectedRules.includes(rule) ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg' : 'border-white/5 text-slate-700 hover:text-slate-400'}`}>
                            {rule} {selectedRules.includes(rule) && <CheckCircle2 size={16} className="text-blue-500"/>}
                        </button>
                    ))}
                </div>
             </div>
             <button onClick={() => { supabase.from('trades').insert([{...form, user_id: user.id, rules_followed: selectedRules}]).then(() => { fetchTrades(); setIsModalOpen(false); }); }} className="w-full bg-white text-black py-6 rounded-[30px] font-black uppercase text-sm hover:bg-blue-600 hover:text-white transition-all shadow-2xl">Execute Journaling</button>
          </div>
        </div>
      )}
    </main>
  );
}

// --- FULL HELPER SUITE ---
function SidebarItem({ icon, label, active, onClick, isOpen }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center rounded-2xl h-14 transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:bg-white/5'} ${isOpen ? 'px-5 gap-4' : 'justify-center'}`}>
      {icon} {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}

function StatBox({ label, value, color = "text-white", trend }) {
  return (
    <div className="bg-[#0F1219] border border-white/5 p-8 rounded-[32px] shadow-xl relative group">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-black italic ${color}`}>{value}</p>
        {trend && <span className="text-[9px] font-black text-emerald-500">{trend}</span>}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="flex flex-col px-5 border-r border-white/10 last:border-0">
            <span className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">{label}</span>
            <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-[11px] font-black text-white outline-none cursor-pointer uppercase">
                {options.map(opt => <option key={opt} value={opt} className="bg-[#0F1219]">{opt}</option>)}
            </select>
        </div>
    );
}

function ModalInput({ label, value, onChange }) {
  return (
    <div className="w-full">
        <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 tracking-widest">{label}</label>
        <input className="w-full bg-[#07090D] border border-white/5 p-5 rounded-[20px] text-white font-black text-[13px] outline-none focus:border-blue-500 transition-all shadow-inner" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function ModalSelect({ label, options, onChange }) {
  return (
    <div className="w-full">
        <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 tracking-widest">{label}</label>
        <select onChange={e => onChange(e.target.value)} className="w-full bg-[#07090D] border border-white/5 p-5 rounded-[20px] text-white font-black text-[11px] uppercase outline-none focus:border-blue-500 appearance-none shadow-inner">
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
  );
}

function SettingToggle({ label, value, options, onChange }) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase block ml-1 tracking-widest">{label}</label>
            <div className="flex gap-2">
                {options.map(opt => (
                    <button key={opt} onClick={() => onChange(opt)} className={`flex-1 py-4 rounded-2xl border text-[10px] font-black transition-all ${value === opt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-white/5 text-slate-500 hover:bg-white/5'}`}>{opt}</button>
                ))}
            </div>
        </div>
    );
}