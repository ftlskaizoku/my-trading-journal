"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
    Plus, X, Zap, Brain, Terminal, 
    Fingerprint, Key, Server, Activity, Target, Sparkles,
    ShieldCheck, History, TrendingUp, Calendar, 
    Globe, Lock, ArrowUpRight, Clock, Search, Filter,
    Image as ImageIcon, ChevronRight, BarChart3, AlertCircle,
    Cpu, Palette // <--- Add Cpu and Palette here
  } from 'lucide-react';

export default function TradingJournal() {
    const [hasMounted, setHasMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeSettingsSubTab, setActiveSettingsSubTab] = useState('appearance');
    const [trades, setTrades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // THEME & UI STATE
    const [accentColor, setAccentColor] = useState('Purple'); 
    const [glassMode, setGlassMode] = useState(true);
    const [borderRadius, setBorderRadius] = useState('40px');
    
    // FILTERS
    const [filterAsset, setFilterAsset] = useState('ALL');
    const [filterStrategy, setFilterStrategy] = useState('ALL');
    const [filterTimeframe, setFilterTimeframe] = useState('ALL');

    // SYNC & FORM STATE
  const [syncMode, setSyncMode] = useState('manual'); // 'manual' or 'auto'
  const [mt5Form, setMt5Form] = useState({ login: '', password: '', server: '', apiKey: '' });
  const [form, setForm] = useState({ 
    symbol: '', pnl: '', strategy: 'VWAP Rejection', direction: 'BUY',
    risk_reward: '1:2', mindset: 'Neutral', exit_quality: 'Good', notes: '', 
    trade_date: new Date().toISOString().split('T')[0],
    screenshot_url: ''
  });

  const accs = { 
    Purple: '#a855f7', Blue: '#3b82f6', Emerald: '#10b981', 
    Rose: '#f43f5e', Amber: '#f59e0b', Indigo: '#6366f1',
    Orange: '#f97316', Cyan: '#06b6d4'
  };

  const theme = {
    bg: '#07090D',
    card: glassMode ? 'rgba(15, 20, 28, 0.8)' : '#0F1219',
    text: '#cbd5e1',
    border: 'rgba(255,255,255,0.06)',
    primary: accs[accentColor]
  };

  useEffect(() => { 
    setHasMounted(true); 
    fetchTrades(); 
  }, []);

  const fetchTrades = async () => {
    const { data, error } = await supabase.from('trades').select('*').order('trade_date', { ascending: true });
    if (data) setTrades(data);
    if (error) console.error("Supabase Fetch Error:", error);
  };

  // FILTERED DATA LOGIC
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const assetMatch = filterAsset === 'ALL' || t.symbol === filterAsset;
      const strategyMatch = filterStrategy === 'ALL' || t.strategy === filterStrategy;
      return assetMatch && strategyMatch;
    });
  }, [trades, filterAsset, filterStrategy]);

  // ADVANCED ANALYTICS ENGINE (AI LOGIC)
  const stats = useMemo(() => {
    if (!filteredTrades.length) return { totalPnL: 0, winRate: 0, pf: '0.00', avgWin: 0, expectancy: 0 };
    const wins = filteredTrades.filter(tr => Number(tr.pnl) > 0);
    const losses = filteredTrades.filter(tr => Number(tr.pnl) < 0);
    const totalPnL = filteredTrades.reduce((acc, tr) => acc + Number(tr.pnl), 0);
    const grossProfit = wins.reduce((acc, tr) => acc + Number(tr.pnl), 0);
    const grossLoss = Math.abs(losses.reduce((acc, tr) => acc + Number(tr.pnl), 0));
    
    return {
        totalPnL: totalPnL.toFixed(2), 
      winRate: ((wins.length / filteredTrades.length) * 100).toFixed(1), 
      pf: grossLoss === 0 ? grossProfit.toFixed(2) : (grossProfit / grossLoss).toFixed(2),
      avgWin: (totalPnL / filteredTrades.length).toFixed(2),
      expectancy: (totalPnL / filteredTrades.length / 100).toFixed(2), // R-unit simulation
      winCount: wins.length,
      lossCount: losses.length,
      beCount: filteredTrades.filter(tr => Number(tr.pnl) === 0).length
    };
  }, [filteredTrades]);

  // NEURAL SUGGESTIONS (AI EFFICIENCY)
  const aiInsights = useMemo(() => {
    if (filteredTrades.length < 5) return ["Insufficient data for neural mapping. Log more executions."];
    const insights = [];
    const bestStrategy = [...new Set(filteredTrades.map(t => t.strategy))]
      .map(s => ({ name: s, pnl: filteredTrades.filter(t => t.strategy === s).reduce((a, b) => a + Number(b.pnl), 0) }))
      .sort((a, b) => b.pnl - a.pnl)[0];

      insights.push(`Maximum alpha detected in ${bestStrategy.name} setups.`);
    if (stats.winRate > 60) insights.push("Current edge is highly consistent. Consider increasing size by 0.5%.");
    if (stats.pf < 1.5) insights.push("Profit factor sub-optimal. Review exit quality on winning trades.");
    return insights;
  }, [filteredTrades, stats]);

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen p-6 md:p-12 transition-all duration-700 font-sans selection:bg-purple-500/30" style={{ backgroundColor: theme.bg, color: theme.text }}>
      
      {/* HEADER & NAV */}
      <nav className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div style={{ backgroundColor: theme.primary }} className="w-16 h-16 rounded-[22px] flex items-center justify-center shadow-[0_0_50px_-10px] shadow-current group-hover:rotate-12 transition-all duration-500">
            <Zap className="text-white fill-white" size={32} />
            </div>
          <div className="flex flex-col">
            <h1 className="text-5xl font-[950] italic uppercase tracking-tighter leading-[0.75] flex flex-col">
              <span className="text-white">TRADE</span>
              <span style={{ color: theme.primary }} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">SYLLA</span>
            </h1>
            <p className="text-[9px] font-black opacity-30 tracking-[0.5em] uppercase mt-3 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-white/20" /> Neural Terminal v1.0
            </p>
          </div>
        </div>

        <div className="flex gap-2 p-1.5 bg-white/5 rounded-[28px] border border-white/5 backdrop-blur-2xl">
          {['dashboard', 'edge', 'sync', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-10 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-black shadow-2xl scale-105' : 'opacity-30 hover:opacity-100 hover:bg-white/5'
              }`}
            >
              {tab === 'dashboard' ? 'Terminal' : tab === 'edge' ? 'Playbook' : tab}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: theme.primary }}
          className="px-10 py-5 rounded-[22px] font-black text-[11px] text-white uppercase tracking-[0.25em] hover:scale-105 active:scale-95 transition-all hidden xl:block shadow-xl shadow-current/20"
        >
          New Execution +
        </button>
        </nav>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          
          {/* FILTERS BAR */}
          <div className="flex flex-wrap gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[30px] items-center">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Filter size={14} className="opacity-40" />
              <select 
                className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                value={filterAsset}
                onChange={(e) => setFilterAsset(e.target.value)}
              >
                <option value="ALL">All Assets</option>
                {[...new Set(trades.map(t => t.symbol))].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Brain size={14} className="opacity-40" />
              <select 
                className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                value={filterStrategy}
                onChange={(e) => setFilterStrategy(e.target.value)}
              >
                <option value="ALL">All Strategies</option>
                {[...new Set(trades.map(t => t.strategy))].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* TOP STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBox label="Net Alpha" value={`$${stats.totalPnL}`} theme={theme} radius={borderRadius} color={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-500"} icon={<TrendingUp size={16}/>} />
            <StatBox label="Success Rate" value={`${stats.winRate}%`} theme={theme} radius={borderRadius} icon={<Target size={16}/>} />
            <StatBox label="Profit Factor" value={stats.pf} theme={theme} radius={borderRadius} color="text-purple-500" icon={<Activity size={16}/>} />
            <StatBox label="Avg Expectancy" value={`$${stats.avgWin}`} theme={theme} radius={borderRadius} icon={<ArrowUpRight size={16}/>} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* PERFORMANCE CURVE */}
            <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-10 border shadow-2xl xl:col-span-2 overflow-hidden group relative">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-[950] italic uppercase tracking-tighter flex items-center gap-3">
                    <Activity className="text-emerald-500" size={20}/> Neural Equity
                  </h3>
                  <p className="text-[9px] font-black opacity-20 uppercase tracking-[0.3em] mt-1">Institutional Performance Flow</p>
                </div>
                </div>
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredTrades.length > 0 ? filteredTrades : [{trade_date: '0', pnl: 0}]}>
                    <defs>
                      <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.primary} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="trade_date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, opacity: 0.3}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, opacity: 0.3}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F1219', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontWeight: '900', fontSize: '12px' }} itemStyle={{ color: theme.primary }} />
                    <Area type="monotone" dataKey="pnl" stroke={theme.primary} strokeWidth={6} fillOpacity={1} fill="url(#colorPnL)" />
                  </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* AI INSIGHTS & ACTIVITY */}
            <div className="space-y-8">
              <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-8 border shadow-xl bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5 rotate-12"><Brain size={120}/></div>
                <h4 className="text-[11px] font-[950] uppercase opacity-40 mb-8 flex items-center gap-2"><Sparkles size={16} className="text-amber-400"/> Neural Suggestions</h4>
                <div className="space-y-4 relative z-10">
                  {aiInsights.map((text, i) => (
                    <div key={i} className="p-6 rounded-[25px] bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-default">
                      <p className="text-[9px] font-black text-purple-400 mb-2 uppercase tracking-widest">Logic Node 0{i+1}</p>
                      <p className="text-xs font-bold opacity-80 italic leading-relaxed">"{text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-8 border shadow-xl flex-1">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[11px] font-[950] uppercase opacity-40">Recent Activity</h4>
                  <History size={16} className="opacity-20"/>
                </div>
                <div className="space-y-4">
                  {filteredTrades.slice(-3).reverse().map((trade, i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-[22px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-8 rounded-full ${Number(trade.pnl) >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div>
                          <p className="text-[11px] font-[950] italic uppercase">{trade.symbol}</p>
                          <p className="text-[8px] opacity-30 font-black uppercase">{trade.trade_date}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-[950] ${Number(trade.pnl) >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {Number(trade.pnl) >= 0 ? '+' : ''}${trade.pnl}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE CALENDAR LEDGER */}
          <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-10 border shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
              </div>
              <h3 className="text-2xl font-[950] italic uppercase tracking-tighter flex items-center gap-3">
                  <Calendar className="text-blue-500" size={20}/> Alpha Ledger
                </h3>
                <p className="text-[9px] font-black opacity-20 uppercase tracking-[0.3em] mt-1">Daily Performance Heatmap</p>
              </div>
              <div className="flex gap-4 text-[10px] font-black uppercase opacity-40">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Wins: {stats.winCount}</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/> Losses: {stats.lossCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Array.from({ length: 28 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (27 - i));
                const dateStr = date.toISOString().split('T')[0];
                const dayTrades = trades.filter(t => t.trade_date === dateStr);
                const dayPnL = dayTrades.reduce((acc, t) => acc + Number(t.pnl), 0);
                const dWins = dayTrades.filter(t => Number(t.pnl) > 0).length;
                const dLosses = dayTrades.filter(t => Number(t.pnl) < 0).length;

                return (
                  <div key={i} className="aspect-square rounded-[22px] border border-white/5 p-4 flex flex-col justify-between group hover:bg-white/[0.04] transition-all relative overflow-hidden"
                       style={{ borderTop: dayTrades.length > 0 ? `5px solid ${dayPnL >= 0 ? '#10b981' : '#f43f5e'}` : '' }}>
                    <span className="text-[10px] font-black opacity-20">{date.getDate()} {date.toLocaleString('default', { month: 'short' })}</span>
                    {dayTrades.length > 0 ? (
                      <div>
                        <p className={`text-xs font-[950] ${dayPnL >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {dayPnL >= 0 ? '+' : ''}${Math.abs(dayPnL).toFixed(0)}
                        </p>
                        <div className="flex gap-2 mt-2">
                        </div>
                        <span className="text-[8px] font-black text-emerald-500/50">{dWins}W</span>
                           <span className="text-[8px] font-black text-rose-500/50">{dLosses}L</span>
                        </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center opacity-5"><Clock size={16}/></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        
      )}

      {/* EDGE (PLAYBOOK) TAB */}
      {activeTab === 'edge' && (
        <div className="animate-in fade-in zoom-in-95 duration-700 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-10 border shadow-2xl lg:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-all duration-1000"><Target size={140}/></div>
            <h3 className="text-3xl font-[950] italic uppercase tracking-tighter mb-10 flex items-center gap-4">
              <ShieldCheck className="text-emerald-500" size={32} /> Playbook Efficiency
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                {[...new Set(trades.map(t => t.strategy))].map((strat, i) => {
                  const stratTrades = trades.filter(t => t.strategy === strat);
                  const winR = ((stratTrades.filter(t => Number(t.pnl) > 0).length / stratTrades.length) * 100).toFixed(1);
                  return (
                    <div key={strat} className="border-l-4 p-6 hover:bg-white/5 transition-all" style={{ borderColor: i % 2 === 0 ? theme.primary : '#10b981' }}>
                      <p className="text-[11px] font-[950] opacity-30 uppercase tracking-[0.2em]">{i === 0 ? 'Master Setup' : 'Secondary Setup'}</p>
                      <p className="text-2xl font-[950] italic uppercase mt-2">{strat}</p>
                      <div className="flex items-center gap-6 mt-4">
                      <span className="text-3xl font-[950]" style={{ color: i % 2 === 0 ? theme.primary : '#10b981' }}>{winR}%</span>
                          <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${winR}%`, backgroundColor: i % 2 === 0 ? theme.primary : '#10b981' }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white/5 rounded-[35px] p-10 border border-white/5 backdrop-blur-md">
                  <h4 className="text-[11px] font-[950] opacity-40 uppercase mb-8 flex items-center gap-2"><Cpu size={14}/> Neural Risk Assessment</h4>
                  <div className="space-y-6">
                    <MetricRow label="Expectancy" val={`+${stats.expectancy}R`} color="text-emerald-400" />
                    <MetricRow label="Profit Factor" val={stats.pf} />
                    <MetricRow label="Max DD" val="-4.2%" color="text-rose-500" />
                    <MetricRow label="Recovery" val="3.85" />
                  </div>
                  <button style={{ backgroundColor: theme.primary }} className="w-full mt-10 py-5 rounded-[22px] text-white font-[950] text-[11px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl">
                    Generate Deep Report
                  </button>
                </div>
              </div>
            </div>

            {/* ALPHA DISTRIBUTION */}
            <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-10 border shadow-xl relative flex flex-col overflow-hidden">
              <h4 className="text-[11px] font-[950] uppercase opacity-40 mb-10 flex items-center gap-2"><Globe size={16}/> Alpha Distribution</h4>
              <div className="flex-1 min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                      data={[...new Set(trades.map(t => t.symbol))].map(s => ({
                        name: s,
                        value: trades.filter(t => t.symbol === s).length
                      }))}
                      innerRadius={90}
                      outerRadius={120}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {trades.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? theme.primary : '#10b981'} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F1219', border: 'none', borderRadius: '15px', fontWeight: '950', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
                </div>
              <div className="mt-8 space-y-4">
                 {[...new Set(trades.map(t => t.symbol))].slice(0, 3).map((s, i) => (
                   <div key={s} className="flex justify-between items-center text-[11px] font-[950] uppercase">
                     <span className="opacity-40 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i % 2 === 0 ? theme.primary : '#10b981' }} /> {s}
                     </span>
                     <span>${trades.filter(t => t.symbol === s).reduce((a, b) => a + Number(b.pnl), 0).toFixed(0)}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYNC TAB */}
      {activeTab === 'sync' && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="p-16 border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="space-y-10 flex-1">
              <div>
                <h3 className="text-4xl font-[950] italic uppercase tracking-tighter flex items-center gap-4">
                  <Server className="text-blue-500" size={32} /> Terminal Bridge
                </h3>
                <p className="text-[11px] font-black opacity-30 uppercase tracking-[0.4em] mt-3">MetaTrader 5 & Broker Gateway</p>
              </div>

              {/* SYNC MODE TOGGLE */}
              <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit">
                <button 
                  onClick={() => setSyncMode('manual')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-[950] uppercase transition-all ${syncMode === 'manual' ? 'bg-white text-black' : 'opacity-40'}`}
                >Manual Log</button>
                <button 
                  onClick={() => setSyncMode('auto')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-[950] uppercase transition-all ${syncMode === 'auto' ? 'bg-blue-500 text-white' : 'opacity-40'}`}
                  >Auto-Sync (API)</button>
                </div>

                <div className="space-y-5">
                  <InputBlock label="MetaTrader Login" val={mt5Form.login} set={(v) => setMt5Form({...mt5Form, login: v})} theme={theme} icon={<Fingerprint size={14}/>} />
                  <InputBlock label="Master Password" val={mt5Form.password} set={(v) => setMt5Form({...mt5Form, password: v})} theme={theme} type="password" icon={<Lock size={14}/>} />
                  <InputBlock label="Broker Server" val={mt5Form.server} set={(v) => setMt5Form({...mt5Form, server: v})} theme={theme} icon={<Globe size={14}/>} />
                  {syncMode === 'auto' && <InputBlock label="Broker API Key" val={mt5Form.apiKey} set={(v) => setMt5Form({...mt5Form, apiKey: v})} theme={theme} icon={<Key size={14}/>} />}
                </div>

                <button 
                  className="w-full py-6 rounded-[25px] bg-white text-black font-[950] text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4"
                  onClick={() => alert("Establishing Secure Handshake with Broker Terminal...")}
                >
                  <Key size={18} /> Authorize Connection
                </button>
              </div>
              <div className="w-full md:w-80 space-y-8">
                <div className="p-8 rounded-[40px] border border-white/5 bg-white/[0.02] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]" />
                    <span className="text-[11px] font-[950] uppercase opacity-50">Link Status: Offline</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 opacity-20" style={{ width: '0%' }} />
                    </div>
                    <p className="text-[9px] font-black opacity-20 uppercase tracking-widest text-center">Neural Link Inactive</p>
                  </div>
                </div>
                <div className="p-8 rounded-[40px] border border-blue-500/20 bg-blue-500/5">
                  <h4 className="text-[10px] font-[950] text-blue-400 uppercase mb-4 flex items-center gap-3">
                    <Brain size={16}/> Chart Intelligence
                  </h4>
                  <p className="text-[11px] font-bold opacity-60 leading-relaxed italic">
                    "Syncing charts allows our AI to analyze price action context, candle structures, and news timing to suggest strategy optimizations."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div style={{ backgroundColor: theme.card, borderRadius }} className="p-10 border border-white/5 space-y-3">
              {['appearance', 'security', 'billing'].map(sub => (
                <button
                key={sub} 
                  onClick={() => setActiveSettingsSubTab(sub)}
                  className={`w-full p-5 rounded-2xl text-[11px] font-[950] uppercase tracking-widest flex items-center gap-4 transition-all ${activeSettingsSubTab === sub ? 'bg-white text-black' : 'hover:bg-white/5 opacity-40'}`}
                >
                  {sub === 'appearance' && <Palette size={16}/>}
                  {sub === 'security' && <Lock size={16}/>}
                  {sub === 'billing' && <Zap size={16}/>}
                  {sub}
                </button>
              ))}
            </div>
            <div style={{ backgroundColor: theme.card, borderRadius }} className="md:col-span-2 p-12 border border-white/5 relative overflow-hidden">
               {activeSettingsSubTab === 'appearance' && (
                 <div className="space-y-12 animate-in fade-in duration-500">
                    <div>
                      <h4 className="text-[11px] font-[950] uppercase opacity-30 mb-8">Neural Accent Palette</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-5">
                      {Object.keys(accs).map(colorName => (
                          <button 
                            key={colorName}
                            onClick={() => setAccentColor(colorName)}
                            className={`h-12 rounded-xl transition-all border-4 ${accentColor === colorName ? 'border-white scale-110 shadow-2xl' : 'border-transparent opacity-40'}`}
                            style={{ backgroundColor: accs[colorName] }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-8 bg-white/5 rounded-[30px] border border-white/5">
                      <div>
                        <p className="text-xs font-[950] uppercase italic tracking-wider">Glassmorphism Mode</p>
                        <p className="text-[10px] font-bold opacity-30 uppercase mt-2">Advanced UI Transparency & Blur</p>
                      </div>
                      <button 
                        onClick={() => setGlassMode(!glassMode)}
                        style={{ backgroundColor: glassMode ? theme.primary : '#333' }}
                        className="w-16 h-9 rounded-full relative transition-all"
                      >
                        <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full transition-all ${glassMode ? 'left-8' : 'left-1.5'}`} />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-[950] uppercase opacity-30 block mb-6 text-center tracking-[0.3em]">Interface Curvature: {borderRadius}</label>
                      <input 
                        type="range" min="0" max="60" value={parseInt(borderRadius)} 
                        onChange={(e) => setBorderRadius(`${e.target.value}px`)}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: theme.primary }}
                      />
                    </div>
                 </div>
                 )}
                 </div>
               </div>
             </div>
           )}
     
           {/* QUICK LOG MODAL */}
           {isModalOpen && (
             <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 animate-in fade-in duration-500">
               <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
               
               <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius }} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto border shadow-2xl p-12 animate-in zoom-in-95 duration-500 no-scrollbar">
                 
                 <div className="flex justify-between items-center mb-12">
                   <div>
                   <h2 className="text-4xl font-[950] italic uppercase tracking-tighter flex items-center gap-4">
                  <Terminal className="text-emerald-500" size={32} /> New Execution
                </h2>
                <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mt-3">Neural Logging Protocol Alpha-1</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-all group">
                <X size={24} className="group-hover:rotate-90 transition-all" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* LEFT: DATA */}
              <div className="space-y-8">
                <InputBlock label="Trading Asset" val={form.symbol} set={(v) => setForm({...form, symbol: v.toUpperCase()})} theme={theme} icon={<Globe size={14}/>} placeholder="e.g. NAS100, XAUUSD" />
                
                <div className="grid grid-cols-2 gap-6">
                <InputBlock label="Net PnL ($)" val={form.pnl} set={(v) => setForm({...form, pnl: v})} theme={theme} type="number" icon={<TrendingUp size={14}/>} />
                  <div>
                    <label className="text-[10px] font-[950] uppercase opacity-20 block mb-3 ml-2 flex items-center gap-2"><Calendar size={14}/> Execution Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/5 p-5 rounded-[22px] font-[950] text-xs outline-none focus:border-white/20 transition-all text-white" 
                      style={{ borderLeft: `5px solid ${theme.primary}` }}
                      value={form.trade_date}
                      onChange={(e) => setForm({...form, trade_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-8 rounded-[35px] bg-white/5 border border-white/5 space-y-6">
                   <p className="text-[11px] font-[950] uppercase opacity-30 italic tracking-widest">Strategy Selection</p>
                   <div className="flex flex-wrap gap-3">
                   {['VWAP Rejection', 'Mean Reversion', 'Trend Cap', 'News Spike'].map(s => (
                       <button 
                         key={s} 
                         onClick={() => setForm({...form, strategy: s})}
                         className={`px-6 py-3 rounded-2xl text-[10px] font-[950] uppercase transition-all ${form.strategy === s ? 'bg-white text-black scale-105 shadow-xl' : 'bg-white/5 opacity-40 hover:opacity-100'}`}
                       >
                         {s}
                       </button>
                       ))}
                   </div>
                </div>
              </div>

              {/* RIGHT: CONTEXT */}
              <div className="space-y-8">
                <div className="space-y-4">
                <label className="text-[10px] font-[950] uppercase opacity-20 ml-2 flex items-center gap-2">
                    <ImageIcon size={14} /> Visual Evidence (Screenshot)
                  </label>
                  <div 
                    className="group border-2 border-dashed border-white/10 rounded-[40px] p-12 flex flex-col items-center justify-center hover:border-white/30 transition-all cursor-pointer bg-white/[0.02]"
                    onClick={() => alert("Upload to Supabase Storage Simulation...")}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus size={24} className="opacity-40" />
                    </div>
                    <p className="text-[10px] font-[950] uppercase opacity-30 italic">Drop Execution Capture</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <SelectBlock label="Risk/Reward" val={form.risk_reward} set={(v) => setForm({...form, risk_reward: v})} theme={theme} options={['1:1', '1:2', '1:3', '1:5+']} />
                  <SelectBlock label="Mindset" val={form.mindset} set={(v) => setForm({...form, mindset: v})} theme={theme} options={['Disciplined', 'Anxious', 'Greedy', 'FOMO']} />
                </div>

                <div className="space-y-3">
                <label className="text-[10px] font-[950] uppercase opacity-20 ml-2 flex items-center gap-2"><Brain size={16} /> Strategy Logic Notes</label>
                  <textarea
                    rows="5"
                    className="w-full bg-white/5 border border-white/5 p-6 rounded-[30px] font-bold text-xs outline-none focus:border-white/20 transition-all resize-none text-white leading-relaxed"
                    style={{ borderLeft: `5px solid ${theme.primary}` }}
                    placeholder="Describe the institutional liquidity flow and entry context..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full mt-12 py-7 rounded-[35px] font-[950] text-sm uppercase tracking-[0.4em] transition-all hover:scale-[1.01] active:scale-95 shadow-2xl relative overflow-hidden group"
              style={{ backgroundColor: theme.primary, color: '#fff' }}
              onClick={async () => {
                const { error } = await supabase.from('trades').insert([form]);
                if (!error) { setIsModalOpen(false); fetchTrades(); }
                else alert("Ledger Sync Error. Check Connection.");
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-4"><Fingerprint size={20}/> Commit to Ledger</span>
            </button>
          </div>
        </div>
      )}

      {/* FIXED QUICK LOG TRIGGER */}
      <button 
        style={{ backgroundColor: theme.primary }} 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-12 right-12 w-24 h-24 text-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-center z-[500] hover:scale-110 active:scale-90 transition-all border border-white/20 group hover:rotate-6"
      >
        <Plus size={40} className="group-hover:rotate-90 transition-transform duration-700" />
      </button>

    </main>
  );
}

// COMPONENTS
function StatBox({ label, value, color, theme, radius, icon }) {
  return (
    <div style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius: radius }} className="border p-10 relative group hover:scale-[1.03] transition-all shadow-2xl overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[11px] font-[950] opacity-40 uppercase tracking-[0.3em]">{label}</p>
        <div style={{ color: theme.primary }} className="opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>
      </div>
      <p className={`text-5xl font-[950] italic tracking-tighter ${color || 'text-white'}`}>{value}</p>
      <div className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700" style={{ backgroundColor: theme.primary }} />
    </div>
  );
}

function InputBlock({ label, val, set, theme, type = "text", icon, placeholder }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-[950] uppercase opacity-20 flex items-center gap-3 ml-3">
        {icon} {label}
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/5 p-5 rounded-[22px] font-[950] text-xs outline-none focus:border-white/30 transition-all text-white placeholder:opacity-10" 
        style={{ borderLeft: `5px solid ${theme.primary}` }} 
        value={val}
        onChange={(e) => set(e.target.value)} 
      />
    </div>
  );
}

function SelectBlock({ label, val, set, theme, options }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-[950] uppercase opacity-20 ml-3">{label}</label>
      <select 
        className="w-full bg-white/5 border border-white/5 p-5 rounded-[22px] font-[950] text-xs outline-none cursor-pointer appearance-none text-white"
        style={{ borderLeft: `5px solid ${theme.primary}` }}
        value={val}
        onChange={(e) => set(e.target.value)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
  );
}

function MetricRow({ label, val, color }) {
  return (
    <div className="flex justify-between items-center text-[11px] font-[950] uppercase italic tracking-widest border-b border-white/5 pb-4">
      <span className="opacity-40">{label}</span>
      <span className={color || 'text-white'}>{val}</span>
    </div>
  );
}