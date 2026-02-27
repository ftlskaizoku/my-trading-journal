"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Cell, PieChart, Pie,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import {
  Plus, X, Zap, Cpu, Settings, Palette, Brain, Terminal,
  Fingerprint, Key, Server, Activity, Target, Sparkles,
  ShieldCheck, History, TrendingUp, Calendar, AlertCircle,
  LayoutDashboard, Globe, Lock, Clock, ArrowUpRight, BarChart4,
  LogOut, User, CreditCard, Languages, CheckCircle2, AlertTriangle, 
  Timer, ZapOff, Image as ImageIcon, ChevronRight, Moon, Sun, 
  Wallet, Gauge, Database, MessageSquare, Briefcase, Menu, Search, Download
} from 'lucide-react';

const TradingTerminal = () => {
  // --- 1. CORE STATE & COMMERCIAL ENGINE ---
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [userTier, setUserTier] = useState('ELITE'); // FREE, PRO, ELITE
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Appearance Preferences
  const [theme, setTheme] = useState({
    primary: '#a855f7', // Purple Neural
    background: '#020408',
    glowIntensity: 0.15
  });

  const [sessionMetrics, setSessionMetrics] = useState({
    alpha: 94.2,
    pnl: 12450,
    winRate: 74.2,
    sharpe: 2.1,
    drawdown: 1.2
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trades, setTrades] = useState([]);

  // --- 2. ADAPTIVE SHELL LOGIC ---
  useEffect(() => {
    setHasMounted(true);
    const handleMouseMove = (e) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      {/* Neural Background Engine */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 transition-opacity duration-1000"
        style={{ 
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${theme.primary}25, transparent 80%)` 
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

<div className="relative z-10 flex h-screen overflow-hidden">
  
  {/* ADAPTIVE SIDEBAR (Sliver to Expanded) */}
  <aside 
    onMouseEnter={() => setIsSidebarExpanded(true)}
    onMouseLeave={() => setIsSidebarExpanded(false)}
    className={`flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-500 z-50 ${
      isSidebarExpanded ? 'w-80' : 'w-24'
    }`}
  >
    <div className="flex flex-col h-full py-10 px-6">
            <div className="flex items-center gap-4 mb-16 overflow-hidden">
              <div className="min-w-[48px] h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <Zap size={24} className="text-white fill-white" />
              </div>
              <div className={`transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-xl font-black italic tracking-tighter leading-none">TERMINAL</h1>
                <p className="text-[7px] font-bold text-purple-500 tracking-[0.4em] mt-1 uppercase">Neural Elite</p>
              </div>
            </div>

            <nav className="space-y-4 flex-1">
              {[
                { id: 'DASHBOARD', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
                { id: 'SYLLEDGE', icon: <Terminal size={20}/>, label: 'Sylledge AI' },
                { id: 'BACKTEST', icon: <Cpu size={20}/>, label: 'AI Backtesting' },
                { id: 'PLAYBOOK', icon: <Brain size={20}/>, label: 'Playbook' },
                { id: 'SETTINGS', icon: <Settings size={20}/>, label: 'User Space' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-6 p-4 rounded-2xl transition-all relative group ${
                    activeTab === item.id ? 'bg-white/5 text-purple-500' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <div className="min-w-[20px]">{item.icon}</div>
                  <span className={`text-[10px] font-black tracking-[0.2em] uppercase transition-opacity duration-300 ${
                    isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* FREE TIER AD ZONE */}
            {userTier === 'FREE' && isSidebarExpanded && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5">
                <p className="text-[8px] font-bold text-white/30 uppercase mb-2">Sponsored Insight</p>
                <div className="h-20 bg-white/5 rounded-lg flex items-center justify-center text-[10px] text-white/20 italic">
                  Premium Alpha Waiting...
                </div>
              </div>
            )}
          </div>
        </aside>
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* TOP NAVIGATION / HEADER */}
          <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md relative z-20">
            <div className="flex items-center gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Neural Node Linked</p>
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest italic">{activeTab}</h2>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isPrivacyMode ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {isPrivacyMode ? <Lock size={14} /> : <Globe size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-tighter">Ghost Mode</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden xl:flex items-center gap-4 px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-right">
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Latency</p>
                  <p className="text-[10px] font-black text-purple-500">14ms</p>
                </div>
                <Activity size={16} className="text-purple-500" />
              </div>

              {/* FLOATING ACTION TRIGGER - TOP HEADER VERSION */}
              <button
              onClick={() => setIsLogModalOpen(true)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Position</span>
            </button>
            
            <div className="w-12 h-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-[1px]">
              <div className="w-full h-full rounded-2xl bg-[#020408] flex items-center justify-center overflow-hidden">
                 <User size={20} className="text-white/40" />
              </div>
            </div>
          </div>
        </header>
        

        {/* DYNAMIC VIEWPORT */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-10 custom-scroll">
            <div className="max-w-[1600px] mx-auto space-y-10">
              {/* Tab-specific content will be injected here in Part 4 */}
              {activeTab === 'DASHBOARD' && (
                <>
                  {/* KPI GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Neural Alpha', value: sessionMetrics.alpha + '%', sub: '+2.4% vs Bench', icon: <Zap size={16}/>, color: 'text-purple-500' },
                      { label: 'Session PnL', value: '$' + sessionMetrics.pnl.toLocaleString(), sub: 'Today', icon: <TrendingUp size={16}/>, color: 'text-emerald-500' },
                      { label: 'Win Probability', value: sessionMetrics.winRate + '%', sub: 'Calculated', icon: <Target size={16}/>, color: 'text-blue-500' },
                      { label: 'Max Drawdown', value: sessionMetrics.drawdown + '%', sub: 'Last 30d', icon: <Activity size={16}/>, color: 'text-rose-500' }
                    ].map((card, i) => (
                      <div key={i} className="group relative bg-white/5 border border-white/5 p-8 rounded-[32px] overflow-hidden hover:border-white/10 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                          {card.icon}
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">{card.label}</p>
                        
                        <div className={`text-3xl font-black italic tracking-tighter mb-2 transition-all duration-700 ${isPrivacyMode ? 'blur-md' : 'blur-0'} ${card.color}`}>
                          {card.value}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-white/50 uppercase">{card.sub}</span>
                          <div className="h-[1px] flex-1 bg-white/5" />
                          <div className="w-12 h-4 rounded-full bg-white/5 overflow-hidden relative">
                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-current opacity-20 animate-shimmer ${card.color}`} />
                          </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  {/* MAIN CHARTING SECTION & NEURAL RADAR */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* ZELLA-STYLE RADAR SCORE */}
                    <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] flex flex-col items-center justify-center">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 self-start">Neural Score</h3>
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                            { subject: 'Win %', A: 80 },
                            { subject: 'RR Ratio', A: 65 },
                            { subject: 'Consistency', A: 90 },
                            { subject: 'Risk Mgmt', A: 70 },
                          ]}>
                            <PolarGrid stroke="#ffffff10" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 8 }} />
                            <Radar name="Trader" dataKey="A" stroke={theme.primary} fill={theme.primary} fillOpacity={0.4} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-center">
                        <span className="text-4xl font-black italic tracking-tighter text-emerald-500">81</span>
                        <p className="text-[8px] font-bold text-white/20 uppercase mt-1">+1.2 vs Last Week</p>
                      </div>
                    </div>

                    {/* UPDATED EQUITY CURVE */}
                    <div className="xl:col-span-2 bg-white/5 border border-white/5 p-10 rounded-[40px] relative overflow-hidden h-[500px]">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest mb-1">Cumulative Equity Curve</h3>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Real-time Performance Sync</p>
                        </div>
                      </div>
                      
                      <div className={`w-full h-full pb-16 transition-all duration-1000 ${isPrivacyMode ? 'blur-2xl opacity-20' : 'opacity-100'}`}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            {t: '08:00', v: 10000}, {t: '10:00', v: 10500}, {t: '12:00', v: 9800}, 
                            {t: '14:00', v: 11800}, {t: '16:00', v: 12450}
                          ]}>
                            <defs>
                              <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="50%" stopColor="#10b981" stopOpacity={0}/>
                                <stop offset="51%" stopColor="#f43f5e" stopOpacity={0}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.3}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="t" hide />
                            <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                            <Tooltip
                            contentStyle={{ backgroundColor: '#0A0C10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900' }}
                          />
                          <Area type="monotone" dataKey="v" stroke={theme.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorPnL)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                </>
              )}
              {/* EXECUTION CALENDAR SECTION */}
              <div className="bg-white/5 border border-white/5 p-10 rounded-[40px]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest">Execution Calendar</h3>
                      <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase">
                         December 2026
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[8px] font-black uppercase text-white/20 mb-2">{day}</div>
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div key={i} className={`h-24 rounded-2xl border border-white/5 p-3 flex flex-col justify-between transition-all hover:bg-white/5 ${
                          [12, 15, 22].includes(i) ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-black/20'
                        }`}>
                          <span className="text-[10px] font-bold text-white/20">{i + 1}</span>
                          {[12, 15, 22].includes(i) && (
                            <div className="text-right">
                              <p className="text-[10px] font-black text-emerald-500">+$242</p>
                              <p className="text-[7px] font-bold text-white/30 uppercase">2 Trades</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
              {activeTab === 'SYLLEDGE' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  {/* SYLLEDGE HEADER & CONTROLS */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Neural Ledger <span className="text-purple-500">v4.0</span></h3>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Analyzing 1,240 historical data points across 4 platforms</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button className="px-4 py-2 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest">MT5 Sync</button>
                        <button className="px-4 py-2 text-white/30 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Broker API</button>
                      </div>
                      <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <Download size={18} />
                      </button>
                      </div>
                  </div>

                  {/* DATA MINE TABLE */}
                  <div className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5">
                            {['Status', 'Asset', 'Type', 'Strategy', 'Risk:Reward', 'PnL', 'Neural Insight'].map((head) => (
                              <th key={head} className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{head}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {[
                            { status: 'Synced', pair: 'XAU/USD', type: 'LONG', strategy: 'VWAP Rejection', rr: '1:3.2', pnl: '+ $1,240', insight: 'Optimal Execution' },
                            { status: 'Manual', pair: 'BTC/USDT', type: 'SHORT', strategy: 'Liquidity Sweep', rr: '1:4.5', pnl: '- $420', insight: 'Slight Early Exit' },
                            { status: 'Synced', pair: 'EUR/USD', type: 'LONG', strategy: 'Trend Alignment', rr: '1:2.0', pnl: '+ $890', insight: 'High Confidence' },
                          ].map((trade, i) => (
                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${trade.status === 'Synced' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{trade.status}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-[11px] font-black italic tracking-tighter">{trade.pair}</td>
                              <td className="px-8 py-6">
                                <span className={`text-[9px] font-black px-3 py-1 rounded-md ${trade.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                  {trade.type}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-[10px] font-bold text-white/50">{trade.strategy}</td>
                              <td className="px-8 py-6 text-[10px] font-black text-white/80">{trade.rr}</td>
                              <td className={`px-8 py-6 text-[11px] font-black transition-all duration-500 ${isPrivacyMode ? 'blur-md' : 'blur-0'} ${trade.pnl.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {trade.pnl}
                              </td>
                              <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[80px]">
                                    <div className="h-full bg-purple-500 w-[70%]" />
                                  </div>
                                  <span className="text-[9px] font-black uppercase text-purple-400">{trade.insight}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* AD SPACE FOR FREE USERS */}
                    {userTier === 'FREE' && (
                      <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Sparkles className="text-purple-500" size={20} />
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Upgrade to <span className="text-white">Neural Elite</span> for unlimited MT5 History Sync</p>
                        </div>
                        <button className="px-6 py-2 bg-purple-500 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">Upgrade Now</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'BACKTEST' && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-10 duration-700">
                  {/* SIMULATION CONTROLS */}
                  <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-6">Simulation Engine</h3>
                      
                      <div className="space-y-6">
                        <div>
                        <label className="text-[9px] font-black uppercase text-white/30 mb-3 block">Time Depth</label>
                          <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-[10px] font-bold outline-none focus:border-purple-500/50 transition-all">
                            <option>Last 6 Months</option>
                            <option>Last 2 Years</option>
                            <option>Max Available History</option>
                          </select>
                        </div>

                        <div>
                        <label className="text-[9px] font-black uppercase text-white/30 mb-3 block">Strategy Logic</label>
                          <textarea 
                            className="w-full h-32 bg-black/40 border border-white/10 p-4 rounded-xl text-[10px] font-bold outline-none focus:border-purple-500/50 resize-none"
                            placeholder="Explain your strategy... (e.g., FVG entries on 5m chart during London Session)"
                          />
                        </div>

                        <button className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all">
                          Run Neural Sim
                        </button>
                      </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[24px]">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-emerald-500">Growth Insight</span>
                      </div>
                      <p className="text-[10px] font-medium text-emerald-500/80 leading-relaxed">
                        Based on your SYLLEDGE data, tightening your Stop Loss by 2 pips on XAU/USD increases profitability by 12.4% annually.
                      </p>
                    </div>
                  </div>

                  {/* SIMULATION RESULTS */}
                  <div className="xl:col-span-3 space-y-10">
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] h-[500px] relative overflow-hidden">
                      <div className="absolute top-10 right-10 flex gap-4">
                        <div className="text-right">
                          <p className="text-[8px] font-bold text-white/20 uppercase">Expected Return</p>
                          <p className="text-xl font-black italic text-emerald-500">+142.8%</p>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-black uppercase tracking-widest mb-10">Probabilistic Outcome Curve</h3>
                      
                      <div className="w-full h-full pb-20">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            {m: 1, v: 100}, {m: 2, v: 120}, {m: 3, v: 115}, {m: 4, v: 160}, {m: 5, v: 190}, {m: 6, v: 242}
                          ]}>
                            <XAxis dataKey="m" hide />
                            <YAxis hide />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0A0C10', border: 'none', borderRadius: '12px' }}
                              itemStyle={{ color: '#a855f7', fontSize: '10px', fontWeight: '900' }}
                            />
                            <Line type="monotone" dataKey="v" stroke={theme.primary} strokeWidth={3} dot={{ fill: theme.primary, r: 4 }} />
                            <Line type="monotone" dataKey="v" stroke={theme.primary} strokeWidth={12} opacity={0.1} />
                          </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { l: 'Simulated Trades', v: '412' },
                        { l: 'Max Drawdown', v: '8.4%' },
                        { l: 'Profit Factor', v: '2.84' }
                      ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl text-center">
                          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-2">{s.l}</p>
                          <p className="text-lg font-black italic tracking-tighter">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    </div>
                </div>
              )}

            {activeTab === 'PLAYBOOK' && (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Neural Playbook</h3>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Validated Edge & Execution Framework</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">
                      <Plus size={14} /> New Strategy Pattern
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                      { title: 'London Open Sweep', rate: '68%', grade: 'A+', setups: 142, tags: ['Liquidity', 'Volatility'] },
                      { title: 'VWAP Mean Reversion', rate: '54%', grade: 'B', setups: 89, tags: ['Trend', 'Volume'] },
                      { title: 'FVG Displacement', rate: '72%', grade: 'S', setups: 64, tags: ['Institutional', 'Impulse'] }
                    ].map((item, i) => (
                      <div key={i} className="group relative bg-white/5 border border-white/5 p-8 rounded-[40px] hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                          <div className={`text-4xl font-black italic tracking-tighter ${item.grade === 'S' ? 'text-purple-500' : 'text-white/20'}`}>
                            {item.grade}
                          </div>
                          <div className="text-right">
                          <p className="text-[8px] font-bold text-white/20 uppercase">Historical Win Rate</p>
                            <p className="text-lg font-black italic text-emerald-500">{item.rate}</p>
                          </div>
                        </div>
                        
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4 group-hover:text-purple-400 transition-colors">{item.title}</h4>
                        
                        <div className="flex gap-2 mb-8">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase tracking-tighter text-white/40">{tag}</span>
                          ))}
                        </div>

                        <div className="space-y-3 mb-8">
                        <p className="text-[9px] font-black uppercase text-white/20 mb-2">Execution Checklist</p>
                          {['H4 Trend Alignment', 'M15 Liquidity Grab', 'Displacement Entry'].map((step, j) => (
                            <div key={j} className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center">
                                <CheckCircle2 size={10} className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <span className="text-[10px] font-bold text-white/60">{step}</span>
                            </div>
                          ))}
                        </div>

                        <div className="h-32 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center group-hover:border-purple-500/20 transition-all">
                          <ImageIcon size={24} className="text-white/5" />
                        </div>
                      </div>
                    ))}
                    </div>

                    {/* INTERACTIVE RULESET */}
                  <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] flex items-center justify-between">
                    <div className="flex gap-10">
                      <div>
                        <p className="text-[8px] font-bold text-white/20 uppercase mb-2">Total Edge Data</p>
                        <p className="text-xl font-black italic uppercase">4.2 TB <span className="text-[10px] text-purple-500 not-italic">Scanned</span></p>
                      </div>
                      <div className="h-10 w-[1px] bg-white/5" />
                      <div>
                        <p className="text-[8px] font-bold text-white/20 uppercase mb-2">Compliance Score</p>
                        <p className="text-xl font-black italic uppercase text-blue-500">92%</p>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="w-10 h-10 rounded-full border-2 border-[#020408] bg-white/10 overflow-hidden" />
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-[#020408] bg-purple-500 flex items-center justify-center text-[10px] font-black italic">
                        +12
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'SETTINGS' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in slide-in-from-right-10 duration-700">
                  {/* SETTINGS NAVIGATION */}
                  <div className="lg:col-span-1 space-y-2">
                    {['Account', 'Security', 'Billing', 'Appearance', 'Broker Sync'].map((sect) => (
                      <button key={sect} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{sect}</span>
                        <ChevronRight size={14} className="text-white/10 group-hover:text-purple-500" />
                      </button>
                    ))}
                    <div className="pt-10">
                       <button className="w-full flex items-center gap-3 p-4 rounded-xl text-rose-500 hover:bg-rose-500/5 transition-all">
                        <LogOut size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                      </button>
                    </div>
                  </div>

                  {/* SETTINGS CONTENT */}
                  <div className="lg:col-span-3 space-y-8">
                    {/* USER PROFILE CARD */}
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] flex items-center gap-8 relative overflow-hidden">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-black italic shadow-2xl">
                        N
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">Neural_Trader_01</h3>
                          <span className="px-3 py-1 bg-purple-500 rounded-md text-[8px] font-black uppercase tracking-tighter shadow-lg shadow-purple-500/20">Elite Tier</span>
                        </div>
                        <p className="text-[10px] font-medium text-white/30 mb-6">node_id: x92j-882k-neural-elite</p>
                        <div className="flex gap-4">
                          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase hover:bg-white/10 transition-all">Change Avatar</button>
                          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase hover:bg-white/10 transition-all">Edit Info</button>
                        </div>
                      </div>
                      <Fingerprint size={80} className="absolute -right-4 -bottom-4 text-white/5" />
                    </div>

                    {/* APPEARANCE & PREFERENCES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white/5 border border-white/5 p-8 rounded-[32px]">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 mb-6 flex items-center gap-2">
                          <Palette size={14} /> UI Appearance
                        </h4>
                        <div className="space-y-6">
                          <div>
                            <p className="text-[9px] font-black text-white/30 uppercase mb-4 tracking-widest">Neural Theme</p>
                            <div className="flex gap-4">
                              {['#a855f7', '#10b981', '#3b82f6', '#f43f5e'].map(c => (
                                <button
                                key={c} 
                                  onClick={() => setTheme({...theme, primary: c})}
                                  className="w-10 h-10 rounded-xl border-2 border-[#020408] shadow-lg transition-transform hover:scale-110 active:scale-90"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-white/30 uppercase mb-4 tracking-widest">Glow Intensity</p>
                             <input type="range" className="w-full accent-purple-500 opacity-50" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/5 p-8 rounded-[32px]">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 mb-6 flex items-center gap-2">
                          <ShieldCheck size={14} /> Security Hub
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <span className="text-[10px] font-bold text-white/60 uppercase">Two-Factor Auth</span>
                            <div className="w-10 h-5 bg-emerald-500/20 rounded-full flex items-center px-1">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 opacity-50">
                            <span className="text-[10px] font-bold text-white/60 uppercase">Hardware Key Sync</span>
                            <Lock size={12} />
                          </div>
                          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Update API Keys</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              

      {/* NEURAL ENTRY MODAL (OVERLAY) */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-[#020408]/90 backdrop-blur-2xl" onClick={() => setIsLogModalOpen(false)} />
          
          <div className="relative w-full max-w-5xl bg-white/5 border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.1)] flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Initialize Position</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Manual override enabled • MT5 Link Active</p>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="p-4 hover:bg-white/5 rounded-full transition-all">
                <X size={24} />
              </button>
              </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scroll">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT: PRIMARY DATA */}
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Instrument</label>
                      <input type="text" placeholder="XAU/USD" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Entry Price</label>
                      <input type="number" placeholder="2042.40" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold focus:border-purple-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {['Lot Size', 'Stop Loss', 'Take Profit'].map((label) => (
                      <div key={label} className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">{label}</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold outline-none" />
                      </div>
                    ))}
                  </div>

                  {/* HYBRID MEDIA UPLOAD */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Evidence (Vision Sync)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] cursor-pointer transition-all">
                        <ImageIcon size={20} className="text-white/20" />
                        <span className="text-[8px] font-black uppercase text-white/30">Upload Screenshot</span>
                      </div>
                      <input type="text" placeholder="Paste Chart URL..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-bold outline-none self-center" />
                    </div>
                  </div>
                </div>

                {/* RIGHT: PLAYBOOK & PSYCHOLOGY */}
                <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-purple-500 tracking-widest mb-6 flex items-center gap-2">
                      <Brain size={14} /> Playbook Validation
                    </h4>
                    <div className="space-y-4">
                      {['HTF Trend Confluence', 'Liquidity Sweep Observed', 'Entry Displacement'].map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                          <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-transparent accent-purple-500" />
                          <span className="text-[10px] font-bold text-white/60">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Mindset / Psychology</label>
                    <div className="flex flex-wrap gap-2">
                      {['Calm', 'Fear of Missing Out', 'Revenge', 'Disciplined'].map(tag => (
                        <button key={tag} className="px-4 py-2 bg-white/5 rounded-lg text-[8px] font-black uppercase border border-white/5 hover:border-purple-500 transition-all">{tag}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-white/5 flex gap-6">
              <button className="flex-1 py-5 bg-white text-black rounded-[20px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                Commit to Sylledge
              </button>
            </div>
          </div>
        </div>
      )}

     {/* FLOATING ACTION BUTTON (Neural FAB) */}
     <button 
        onClick={() => setIsLogModalOpen(true)}
        className="fixed bottom-10 right-10 w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-90 transition-all z-40 group"
      >
        <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 group-hover:opacity-0" />
      </button>

            </div> {/* Close max-w-[1600px] */}
          </div> {/* Close Dynamic Viewport */}
        </main> 
      </div> 
    </div> 
  );
};

export default TradingTerminal;