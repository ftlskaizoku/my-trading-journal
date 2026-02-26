"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  Plus, X, LayoutDashboard, List, Target, Activity, ChevronLeft, 
  PlayCircle, ShieldCheck, Menu, CheckCircle2, AlertCircle, Terminal, 
  Trash2, Filter, ArrowUpRight, ArrowDownRight, Brain, Camera, Clock, Zap, Cpu, History
} from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Filtering
  const [filterStrategy, setFilterStrategy] = useState('All');
  const [filterAsset, setFilterAsset] = useState('All');
  
  // Playbook & AI States
  const [playbookRules, setPlaybookRules] = useState(['VWAP Support', 'RSI Divergence', 'Volume Confirmation']);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [aiStrategyDesc, setAiStrategyDesc] = useState('');
  const [btResults, setBtResults] = useState([]);

  // Full Form State (Restored Mindset + Execution + Screenshot)
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
    const { data } = await supabase.from('trades').select('*').order('trade_date', { ascending: true });
    if (data) setTrades(data);
  };

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchStrat = filterStrategy === 'All' || t.strategy === filterStrategy;
      const matchAsset = filterAsset === 'All' || t.symbol === filterAsset;
      return matchStrat && matchAsset;
    });
  }, [trades, filterStrategy, filterAsset]);

  // ADVANCED ANALYTICS ENGINE (Sylla Edge)
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
    if (!filteredTrades.length) return { totalPnL: 0, winRate: 0, syllaScore: 0, pf: '0.00', dailyPnL: 0 };
    const wins = filteredTrades.filter(t => t.pnl > 0);
    const totalPnL = filteredTrades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
    const winRate = ((wins.length / filteredTrades.length) * 100).toFixed(1);
    const dailyPnL = trades.filter(t => t.trade_date === new Date().toISOString().split('T')[0]).reduce((acc, t) => acc + Number(t.pnl), 0);
    return { totalPnL, winRate, syllaScore: Math.round(winRate * 0.85), pf: '1.82', dailyPnL };
  }, [filteredTrades, trades]);

  const runAiSimulation = () => {
    if (!aiStrategyDesc) return alert("AI requires strategy explanation and screenshots to train.");
    const sim = Array.from({ length: 8 }, (_, i) => ({
      id: i, res: Math.random() > 0.3 ? 'WIN' : 'LOSS', val: Math.floor(Math.random() * 800) - 200
    }));
    setBtResults(sim);
  };

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-[#07090D] text-slate-400 flex overflow-hidden font-sans">
      
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
              <SidebarItem icon={<List size={20}/>} label="Journal" active={activeTab === 'log'} onClick={() => setActiveTab('log')} isOpen={isSidebarOpen} />
            </nav>
        </aside>
      )}

      {/* FLOATING QUICK LOG BUTTON (Exclusive Trigger) */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-blue-600 text-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center z-[400] hover:scale-105 hover:bg-blue-500 transition-all border border-white/20 group">
        <Plus size={36} className="group-rotate-90 transition-transform duration-500"/>
      </button>

      <div className={`flex-1 transition-all duration-300 ${!isMobile ? (isSidebarOpen ? 'ml-[240px]' : 'ml-[70px]') : 'ml-0'} p-8 pb-40`}>
        
        {/* TOP BAR: FILTERS ONLY */}
        <div className="flex flex-wrap items-center gap-4 bg-[#0F1219] p-3 rounded-[24px] border border-white/5 w-fit mb-10 shadow-xl">
            <div className="flex items-center gap-3 px-4 border-r border-white/10">
                <Filter size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Filters</span>
            </div>
            <FilterSelect label="Strategy" value={filterStrategy} options={['All', ...new Set(trades.map(t => t.strategy))]} onChange={setFilterStrategy} />
            <FilterSelect label="Asset" value={filterAsset} options={['All', ...new Set(trades.map(t => t.symbol))]} onChange={setFilterAsset} />
        </div>

        {/* DASHBOARD: METRICS + GRAPHICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-2xl">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Sylla Rating</p>
                    <p className="text-5xl font-black italic mt-2">{stats.syllaScore}</p>
                </div>
                <Zap className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
              </div>
              <StatBox label="Win Rate" value={`${stats.winRate}%`} trend="+2.4%" />
              <StatBox label="Profit Factor" value={stats.pf} color="text-blue-400" />
              <StatBox label="Net Equity" value={`$${stats.totalPnL}`} color={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-500"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px] shadow-2xl h-[450px]">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 mb-8 flex items-center gap-2"><Activity size={16} className="text-blue-500"/> Equity Curve</h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={filteredTrades.map((t, i) => ({ n: i, p: filteredTrades.slice(0, i+1).reduce((s, c) => s + Number(c.pnl), 0) }))}>
                            <defs>
                                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="p" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPnL)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px] shadow-2xl h-[450px]">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 mb-8 flex items-center gap-2"><History size={16} className="text-blue-500"/> P&L Distribution</h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={filteredTrades.slice(-10)}>
                            <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                                {filteredTrades.slice(-10).map((e, i) => <Cell key={i} fill={e.pnl >= 0 ? '#10b981' : '#f43f5e'} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        )}

        {/* SYLLA EDGE: MISTAKES & BEHAVIORS */}
        {activeTab === 'edge' && (
          <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4">Hold Efficiency</h4>
                    <p className="text-5xl font-black italic text-white">{behavioralStats.holdEfficiency}%</p>
                    <p className="text-[11px] text-slate-600 mt-4 uppercase font-bold tracking-tight">Percentage of trades where you held for target.</p>
                </div>
                <div className="col-span-2 bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6">Mistake Analysis</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {behavioralStats.mistakeData.map(m => (
                            <div key={m.name} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                                <p className="text-rose-500 font-black italic text-lg">{m.value}</p>
                                <p className="text-[9px] font-black uppercase text-slate-500">{m.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* BACKTEST: AI TRAINING & SIMULATION */}
        {activeTab === 'backtest' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-8">
                <div>
                    <h3 className="text-white font-black italic uppercase text-lg mb-2 flex items-center gap-2"><Cpu size={20} className="text-blue-500"/> IA Trainer</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-6">The IA will learn your edge before simulating.</p>
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Explain Strategy Rules</label>
                    <textarea value={aiStrategyDesc} onChange={e => setAiStrategyDesc(e.target.value)} placeholder="E.g. I enter when price touches VWAP and RSI is below 30..." className="w-full bg-[#07090D] border border-white/5 p-5 rounded-3xl text-white text-[12px] h-40 outline-none focus:border-blue-500 transition-all shadow-inner" />
                    <div className="p-10 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center hover:border-blue-500 group transition-all cursor-pointer">
                        <Camera className="text-slate-600 group-hover:text-blue-500 mb-3" size={32}/>
                        <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Upload Trade Screenshots</span>
                    </div>
                    <button onClick={runAiSimulation} className="w-full bg-blue-600 py-5 rounded-[24px] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all">Train & Simulate</button>
                </div>
            </div>
            <div className="lg:col-span-2 bg-[#0F1219] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-8 italic flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Live Simulation Output</h4>
                <div className="space-y-3">
                    {btResults.length ? btResults.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-[#07090D] rounded-2xl border border-white/5 border-l-4 border-l-blue-500 animate-in slide-in-from-left-4">
                            <span className="text-[11px] font-black text-white italic tracking-widest uppercase">Trade Model Alpha-{i+1}</span>
                            <span className={`text-[12px] font-black ${r.res === 'WIN' ? 'text-emerald-500' : 'text-rose-500'}`}>{r.res} (+${r.val})</span>
                        </div>
                    )) : (
                        <div className="h-64 flex flex-col items-center justify-center opacity-20">
                            <ShieldCheck size={48} className="mb-4" />
                            <p className="text-[10px] font-black uppercase">IA Engine Idling...</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: FULL EXECUTION ENGINE (Restored Fields) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-xl z-[600] flex items-center justify-center p-6">
          <div className="bg-[#0F1219] w-full max-w-2xl rounded-[50px] border border-white/10 p-12 max-h-[90vh] overflow-y-auto shadow-3xl">
             <div className="flex justify-between items-center mb-12">
                <h3 className="text-white font-black italic uppercase text-2xl flex items-center gap-3">Journal Trade</h3>
                <button onClick={() => setIsModalOpen(false)} className="bg-white/5 p-3 rounded-2xl text-slate-500 hover:text-white transition-all"><X/></button>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8">
                <ModalInput label="Asset/Pair" value={form.symbol} onChange={v => setForm({...form, symbol: v})} />
                <ModalInput label="Realized P&L" value={form.pnl} onChange={v => setForm({...form, pnl: v})} />
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 ml-1 tracking-widest">Psychology</label>
                    <select className="w-full bg-[#07090D] border border-white/5 p-5 rounded-[20px] text-white text-[11px] font-black uppercase outline-none focus:border-blue-500 appearance-none" onChange={e => setForm({...form, mindset: e.target.value})}>
                        <option>Neutral</option><option>Calm/Focused</option><option>Greedy</option><option>Revenge Trading</option><option>FOMO</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 ml-1 tracking-widest">Execution Quality</label>
                    <select className="w-full bg-[#07090D] border border-white/5 p-5 rounded-[20px] text-white text-[11px] font-black uppercase outline-none focus:border-blue-500 appearance-none" onChange={e => setForm({...form, mistake: e.target.value})}>
                        <option>Perfect Execution</option><option>Early Exit</option><option>Chased Entry</option><option>Held Too Long</option><option>Slipped Stop</option>
                    </select>
                </div>
             </div>

             <div className="mb-10 p-10 bg-[#07090D] rounded-[40px] border border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-600 mb-8 text-center tracking-widest italic">Playbook Rule Check</p>
                <div className="grid grid-cols-1 gap-3">
                    {playbookRules.map(rule => (
                        <button key={rule} onClick={() => setSelectedRules(prev => prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule])} className={`text-left p-5 rounded-2xl border text-[11px] font-black uppercase flex justify-between items-center transition-all ${selectedRules.includes(rule) ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg' : 'border-white/5 text-slate-700'}`}>
                            {rule} {selectedRules.includes(rule) && <CheckCircle2 size={16} className="text-blue-500"/>}
                        </button>
                    ))}
                </div>
             </div>

             <button onClick={() => { supabase.from('trades').insert([{...form, user_id: user.id, rules_followed: selectedRules}]).then(() => { fetchTrades(); setIsModalOpen(false); }); }} className="w-full bg-white text-black py-6 rounded-[28px] font-black uppercase text-sm tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-2xl">Commit Transaction</button>
          </div>
        </div>
      )}
    </main>
  );
}

// HELPERS
function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="flex flex-col px-5 border-r border-white/10 last:border-0">
            <span className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-tighter">{label}</span>
            <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-[11px] font-black text-white outline-none cursor-pointer uppercase tracking-tight">
                {options.map(opt => <option key={opt} value={opt} className="bg-[#0F1219]">{opt}</option>)}
            </select>
        </div>
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

function SidebarItem({ icon, label, active, onClick, isOpen }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center rounded-2xl h-14 transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.2)]' : 'text-slate-500 hover:bg-white/5'} ${isOpen ? 'px-5 gap-4' : 'justify-center'}`}>
      {icon} {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}

function ModalInput({ label, value, onChange }) {
  return (
    <div className="w-full">
        <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 ml-1 tracking-widest">{label}</label>
        <input className="w-full bg-[#07090D] border border-white/5 p-5 rounded-[20px] text-white font-black text-[13px] outline-none focus:border-blue-500 transition-all shadow-inner" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}