"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  Trash2, LogOut, Plus, X, BarChart3, Calculator, 
  TrendingUp, BookOpen, Search, Calendar as CalIcon, 
  LayoutDashboard, List, Target, Zap, Activity,
  ChevronRight, Camera, Filter, Award, PlayCircle, ShieldCheck, Menu, 
  CheckCircle2, AlertCircle, PlusCircle, Save
} from 'lucide-react';

export default function TradingJournal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtering States
  const [filterStrategy, setFilterStrategy] = useState('All');
  const [filterDirection, setFilterDirection] = useState('All');
  const [filterAsset, setFilterAsset] = useState('All');

  // Playbook State
  const [playbooks, setPlaybooks] = useState([
    { id: 1, name: 'VWAP Bounce', rules: ['Price above VWAP', 'RSI < 30', 'Bullish Engulfing'], status: 'Proven' }
  ]);
  const [newRule, setNewRule] = useState("");

  // Backtest State
  const [btData, setBtData] = useState([]);
  const [btForm, setBtForm] = useState({ win: '', loss: '', trades: '20' });

  const [form, setForm] = useState({ 
    symbol: '', pnl: '', strategy: 'Trend', direction: 'BUY',
    entry_price: '', exit_price: '', image_url: '', notes: '', grade: 'A', 
    trade_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setHasMounted(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
  }, []);

  useEffect(() => { if (user) fetchTrades(); }, [user]);

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*').order('trade_date', { ascending: true });
    if (data) setTrades(data);
  };

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchStrat = filterStrategy === 'All' || t.strategy === filterStrategy;
      const matchDir = filterDirection === 'All' || t.direction === filterDirection;
      const matchAsset = filterAsset === 'All' || t.symbol === filterAsset;
      return matchStrat && matchDir && matchAsset;
    });
  }, [trades, filterStrategy, filterDirection, filterAsset]);

  const stats = useMemo(() => {
    if (!filteredTrades.length) return { totalPnL: 0, winRate: 0, syllaScore: 0, pf: '0.00', dailyPnL: 0 };
    const totalPnL = filteredTrades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
    const wins = filteredTrades.filter(t => t.pnl > 0);
    const winRate = ((wins.length / filteredTrades.length) * 100).toFixed(1);
    const avgWin = wins.length > 0 ? wins.reduce((acc, t) => acc + Number(t.pnl), 0) / wins.length : 0;
    const losses = filteredTrades.filter(t => t.pnl < 0);
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((acc, t) => acc + Number(t.pnl), 0) / losses.length) : 0;
    const pf = avgLoss !== 0 ? (avgWin / avgLoss).toFixed(2) : '2.50';
    const syllaScore = Math.round((parseFloat(winRate) * 0.4) + (Math.min(pf / 3 * 100, 100) * 0.6));
    const today = new Date().toISOString().split('T')[0];
    const dailyPnL = filteredTrades.filter(t => t.trade_date === today).reduce((acc, t) => acc + Number(t.pnl), 0);
    return { totalPnL, winRate, syllaScore, pf, dailyPnL };
  }, [filteredTrades]);

  const runBacktest = () => {
    const results = [];
    let balance = 0;
    const wR = parseFloat(btForm.win) / 100;
    for (let i = 0; i < parseInt(btForm.trades); i++) {
      const won = Math.random() < wR;
      balance += won ? 200 : -100; // Assuming 2:1 RR
      results.push({ trade: i + 1, balance });
    }
    setBtData(results);
  };

  const handleAddTrade = async () => {
    const { error } = await supabase.from('trades').insert([{ ...form, user_id: user.id }]);
    if (!error) { setIsModalOpen(false); fetchTrades(); }
  };

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-[#07090D] text-slate-400 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0F1219] border-r border-white/5 transition-all duration-300 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-center border-b border-white/5">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-white/5 rounded-xl text-white">
              {isSidebarOpen ? <ChevronLeft /> : <Menu />}
            </button>
          </div>
          <nav className="flex-1 px-3 space-y-2 mt-6">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isOpen={isSidebarOpen} />
            <SidebarItem icon={<List size={20}/>} label="Trade Log" active={activeTab === 'log'} onClick={() => setActiveTab('log')} isOpen={isSidebarOpen} />
            <SidebarItem icon={<PlayCircle size={20}/>} label="Playbook" active={activeTab === 'playbook'} onClick={() => setActiveTab('playbook')} isOpen={isSidebarOpen} />
            <SidebarItem icon={<ShieldCheck size={20}/>} label="Backtest" active={activeTab === 'backtest'} onClick={() => setActiveTab('backtest')} isOpen={isSidebarOpen} />
          </nav>
        </div>
      </aside>

      {/* CONTENT */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 h-screen overflow-y-auto`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{activeTab}</h1>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">TRADESYLLA ENGINE v4.0</p>
          </div>
          {activeTab === 'dashboard' && (
            <div className="flex gap-3 bg-[#0F1219] p-2 rounded-2xl border border-white/5">
                <FilterSelect label="Strategy" value={filterStrategy} options={['All', ...new Set(trades.map(t => t.strategy))]} onChange={setFilterStrategy} />
                <FilterSelect label="Asset" value={filterAsset} options={['All', ...new Set(trades.map(t => t.symbol))]} onChange={setFilterAsset} />
            </div>
          )}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sylla Score</p>
                <p className="text-6xl font-black italic mt-2">{stats.syllaScore}</p>
              </div>
              <StatBox label="Win Rate" value={`${stats.winRate}%`} />
              <StatBox label="Net P&L" value={`$${stats.totalPnL.toLocaleString()}`} color={stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-500'} />
              <StatBox label="Profit Factor" value={stats.pf} color="text-blue-500" />
            </div>
            <div className="bg-[#0F1219] border border-white/5 p-8 rounded-[40px] h-96">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredTrades.map((t, i) => ({ name: t.trade_date, pnl: filteredTrades.slice(0, i+1).reduce((s, c) => s + Number(c.pnl), 0) }))}>
                    <defs><linearGradient id="pG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                    <Area type="monotone" dataKey="pnl" stroke="#2563eb" fill="url(#pG)" strokeWidth={4} dot={false} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
            <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px]">
              <h3 className="text-white font-black text-xl italic uppercase mb-6 flex items-center gap-2"><Target className="text-blue-500"/> Define Strategy</h3>
              <div className="space-y-6">
                <ModalInput label="Strategy Name" placeholder="e.g. Mean Reversion" />
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Confirmation Rules</label>
                  {playbooks[0].rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#07090D] p-4 rounded-xl border border-white/5 text-sm text-white font-medium">
                      <CheckCircle2 size={16} className="text-emerald-500"/> {rule}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input className="flex-1 bg-[#07090D] border border-white/5 p-4 rounded-xl text-white outline-none" placeholder="Add rule..." />
                    <button className="bg-blue-600 px-4 rounded-xl text-white"><Plus/></button>
                  </div>
                </div>
                <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Save Playbook</button>
              </div>
            </div>
            <div className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[40px] flex flex-col justify-center text-center">
              <Zap size={48} className="text-blue-500 mx-auto mb-4"/>
              <h4 className="text-white font-black italic text-lg uppercase">Why use Playbooks?</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">Playbooks turn "guessing" into "execution." By defining your rules, TRADESYLLA can track which specific rules lead to your highest win-rate trades.</p>
            </div>
          </div>
        )}

        {activeTab === 'backtest' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px] grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
              <ModalInput label="Win Rate (%)" value={btForm.win} onChange={v => setBtForm({...btForm, win: v})} placeholder="e.g. 50" />
              <ModalInput label="Num of Trades" value={btForm.trades} onChange={v => setBtForm({...btForm, trades: v})} placeholder="20" />
              <button onClick={runBacktest} className="bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all">Run Simulation</button>
            </div>
            
            {btData.length > 0 && (
              <div className="bg-[#0F1219] border border-white/5 p-10 rounded-[40px] h-[400px]">
                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8">Expected Equity Curve (Randomized Sample)</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={btData}>
                    <XAxis dataKey="trade" stroke="#475569" fontSize={10} />
                    <YAxis stroke="#475569" fontSize={10} />
                    <Tooltip />
                    <Area type="stepAfter" dataKey="balance" stroke="#10b981" fill="#10b98120" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'log' && (
            <div className="bg-[#0F1219] border border-white/5 rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest">
                        <tr><th className="px-8 py-5">Asset</th><th className="px-8 py-5">Strategy</th><th className="px-8 py-5 text-right">P&L</th></tr>
                    </thead>
                    <tbody>
                        {filteredTrades.slice().reverse().map(t => (
                            <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                                <td className="px-8 py-5 font-black text-white italic">{t.symbol}</td>
                                <td className="px-8 py-5 text-[10px] font-bold uppercase">{t.strategy}</td>
                                <td className={`px-8 py-5 text-right font-black ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>${t.pnl}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl z-50 hover:scale-110 transition-transform cursor-pointer">
        <Plus size={32}/>
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-[#0F1219] rounded-[48px] w-full max-w-2xl border border-white/10 p-10">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">New Journal Entry</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X/></button>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <ModalInput label="Symbol" value={form.symbol} onChange={v => setForm({...form, symbol: v})} placeholder="EURUSD" />
                <ModalInput label="P&L ($)" value={form.pnl} onChange={v => setForm({...form, pnl: v})} placeholder="100.00" />
                <ModalInput label="Strategy" value={form.strategy} onChange={v => setForm({...form, strategy: v})} placeholder="Breakout" />
                <div className="col-span-2">
                    <button onClick={handleAddTrade} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase tracking-widest text-[10px]">Record Execution</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// HELPERS
function SidebarItem({ icon, label, active, onClick, isOpen }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center rounded-2xl transition-all h-14 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:bg-white/5'} ${isOpen ? 'px-6 gap-4' : 'justify-center'}`}>
      {icon} {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}

function StatBox({ label, value, color = "text-white" }) {
  return (
    <div className="bg-[#0F1219] border border-white/5 p-8 rounded-[32px]">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black italic ${color}`}>{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col px-3 border-r border-white/5 last:border-0">
      <span className="text-[8px] font-black text-slate-600 uppercase mb-1">{label}</span>
      <select className="bg-transparent text-xs font-black text-white outline-none cursor-pointer uppercase" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(opt => <option key={opt} value={opt} className="bg-[#0F1219]">{opt}</option>)}
      </select>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder }) {
  return (
    <div>
        <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">{label}</label>
        <input className="w-full bg-[#07090D] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-blue-500" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}