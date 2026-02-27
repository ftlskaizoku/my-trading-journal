"use client";

import React, { useState, useEffect } from 'react';
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
  Wallet, Gauge, Database, MessageSquare, Briefcase, Menu, Search, Download, Info
} from 'lucide-react';

const TradingTerminal = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [activeSettingTab, setActiveSettingTab] = useState('Account'); 
  const [userTier, setUserTier] = useState('ELITE');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  
  const [theme, setTheme] = useState({
    primary: '#a855f7',
    background: '#020408',
    mode: 'dark'
  });
  return (
    <div className="relative z-10 flex h-screen overflow-hidden text-white" style={{ backgroundColor: theme.background }}>
      {/* SIDEBAR NAVIGATION */}
      <aside 
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-500 z-50 ${isSidebarExpanded ? 'w-80' : 'w-24'}`}
      >
        <div className="flex flex-col h-full py-10 px-6">
          {/* BRAND LOGO */}
          <div className="flex items-center gap-4 mb-16 overflow-hidden">
            <div className="min-w-[48px] h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <div className={`transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-xl font-black italic tracking-tighter leading-none">TERMINAL</h1>
              <p className="text-[7px] font-bold text-purple-500 tracking-[0.4em] mt-1 uppercase">Neural Elite</p>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="space-y-4 flex-1">
            {[
              { id: 'DASHBOARD', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
              { id: 'SYLLEDGE', icon: <Terminal size={20}/>, label: 'Sylledge AI' },
              { id: 'BACKTEST', icon: <Cpu size={20}/>, label: 'AI Backtesting' },
              { id: 'PLAYBOOK', icon: <Brain size={20}/>, label: 'Playbook' },
              { id: 'SETTINGS', icon: <Settings size={20}/>, label: 'Settings' }, 
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-6 p-4 rounded-2xl transition-all relative group ${activeTab === item.id ? 'bg-white/5 text-purple-500' : 'text-white/40 hover:text-white'}`}
              >
                <div className="min-w-[20px]">{item.icon}</div>
                <span className={`text-[10px] font-black tracking-[0.2em] uppercase transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* HEADER */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-8">
            <h2 className="text-sm font-black uppercase tracking-widest italic">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* NEW POSITION BUTTON */}
            <button 
              onClick={() => setIsLogModalOpen(true)} 
              className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl transition-all hover:scale-105 shadow-xl"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Position</span>
            </button>

            {/* ACCOUNT ICON -> SETTINGS (Point A/9) */}
            <button 
              onClick={() => {
                setActiveTab('SETTINGS');
                setActiveSettingTab('Account');
              }} 
              className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all group"
            >
               <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <User size={20} className="text-white/40 group-hover:text-purple-500" />
               </div>
            </button>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-10 custom-scroll">
          <div className="max-w-[1600px] mx-auto space-y-10">

            {/* --- DASHBOARD VIEW --- */}
            {activeTab === 'DASHBOARD' && (
              <>
                {/* KPI GRID (Points A/1, A/2, A/3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Neural Alpha', value: '94.2%', sub: '+2.4% vs Bench', icon: <Zap size={16}/>, color: 'text-purple-500', info: 'Proprietary AI score based on execution quality and emotional discipline.' },
                    { label: 'P&L', value: '$12,450', sub: 'Filtered View', icon: <TrendingUp size={16}/>, color: 'text-emerald-500', info: 'Net Profit or Loss for the selected timeframe and strategy.' },
                    { label: 'Win Rate', value: '74.2%', sub: 'Validated', icon: <Target size={16}/>, color: 'text-blue-500', info: 'The percentage of trades that resulted in a profit.' },
                    { label: 'Max Drawdown', value: '1.2%', sub: 'Last 30d', icon: <Activity size={16}/>, color: 'text-rose-500', info: 'The maximum observed loss from a peak to a trough of a portfolio.' }
                  ].map((card, i) => (
                    <div key={i} className="group relative bg-white/5 border border-white/5 p-8 rounded-[32px] hover:border-white/10 transition-all duration-500">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{card.label}</p>
                        <div className="relative group/tooltip">
                          <Info size={14} className="text-white/10 hover:text-purple-500 cursor-help transition-colors" />
                          <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-black border border-white/10 rounded-xl text-[8px] leading-relaxed text-white/60 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                            {card.info}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`text-3xl font-black italic tracking-tighter mb-2 ${card.color}`}>
                        {card.value}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-white/50 uppercase">{card.sub}</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* MAIN ANALYTICS SECTION */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                  {/* 1. UPGRADED NEURAL SCORE (Point A/5) */}
                  <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 self-start flex items-center gap-2">
                      <Cpu size={14} className="text-purple-500" /> Performance DNA
                    </h3>
                    
                    <div className="w-full h-64 relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                          { subject: 'Win %', A: 85 },
                          { subject: 'RR Ratio', A: 70 },
                          { subject: 'Psychology', A: 90 },
                          { subject: 'Risk Mgmt', A: 75 },
                          { subject: 'Timing', A: 60 },
                        ]}>
                          <PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 8, fontWeight: 'bold' }} />
                          <Radar name="Trader" dataKey="A" stroke={theme.primary} fill={theme.primary} fillOpacity={0.5} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6 text-center relative z-10">
                      <span className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                        81
                      </span>
                      <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mt-2">Neural Grade: Optimal</p>
                    </div>
                  </div>
                  
                  {/* 2. EQUITY CURVE WITH TIMEFRAME FILTERS (Point A/6) */}
                  <div className="xl:col-span-2 bg-white/5 border border-white/5 p-10 rounded-[40px] relative overflow-hidden h-[510px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-1">Equity Growth</h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Real-time Performance Analysis</p>
                      </div>
                      
                      {/* TIMEFRAME SELECTOR (Point A/6) */}
                      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        {['1D', '1W', '1M', '3M', 'ALL'].map((tf) => (
                          <button 
                            key={tf} 
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${tf === 'ALL' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'W1', val: 4000 }, { name: 'W2', val: 3000 }, 
                          { name: 'W3', val: 5000 }, { name: 'W4', val: 4500 }, 
                          { name: 'W5', val: 7000 }, { name: 'W6', val: 12450 }
                        ]}>
                          <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" hide />
                          <YAxis hide domain={['auto', 'auto']} />
                          <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                          <Area type="monotone" dataKey="val" stroke={theme.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 3. PERFORMANCE DISTRIBUTION (Point A/8) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 xl:col-span-3">
                  {/* PnL BY DAY OF WEEK */}
                  <div className="bg-white/5 border border-white/5 p-8 rounded-[40px]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">PnL Distribution (Weekly)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { day: 'Mon', pnl: 2400 }, { day: 'Tue', pnl: -1100 }, 
                          { day: 'Wed', pnl: 3200 }, { day: 'Thu', pnl: 4500 }, 
                          { day: 'Fri', pnl: -800 }
                        ]}>
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 10}} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                          <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                            { [2400, -1100, 3200, 4500, -800].map((entry, index) => (
                              <Cell key={index} fill={entry > 0 ? '#10b981' : '#f43f5e'} fillOpacity={0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* PnL BY ASSET / PAIR */}
                  <div className="bg-white/5 border border-white/5 p-8 rounded-[40px]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Asset Performance</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={[
                          { asset: 'XAUUSD', pnl: 5200 }, { asset: 'EURUSD', pnl: 1800 }, 
                          { asset: 'BTCUSD', pnl: -1200 }, { asset: 'NAS100', pnl: 2900 }
                        ]}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="asset" type="category" axisLine={false} tickLine={false} tick={{fill: '#ffffff40', fontSize: 10}} width={60} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                          <Bar dataKey="pnl" radius={[0, 6, 6, 0]}>
                            { [5200, 1800, -1200, 2900].map((entry, index) => (
                              <Cell key={index} fill={entry > 0 ? theme.primary : '#f43f5e'} fillOpacity={0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* EXECUTION CALENDAR (Dashboard Only - Point D/1) */}
                <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest mb-1">Execution Calendar</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Consistency Tracking</p>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                      <ChevronRight className="rotate-180 cursor-pointer hover:text-white transition-colors" size={14} />
                      December 2026
                      <ChevronRight className="cursor-pointer hover:text-white transition-colors" size={14} />
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-[8px] font-black uppercase text-white/20 mb-2">{day}</div>
                    ))}
                    {Array.from({ length: 31 }).map((_, i) => (
                      <div key={i} className={`h-24 rounded-2xl border border-white/5 p-3 flex flex-col justify-between transition-all hover:bg-white/10 group/day ${
                        [12, 15, 22].includes(i) ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/20'
                      }`}>
                        <span className="text-[10px] font-bold text-white/20 group-hover/day:text-white transition-colors">{i + 1}</span>
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
              </>
            )}

            {/* --- SYLLEDGE AI VIEW --- */}
            {activeTab === 'SYLLEDGE' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* MT5 / BROKER SYNC (Point B/2) */}
                  <div className="lg:col-span-1 bg-white/5 border border-white/5 p-8 rounded-[40px] space-y-8">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest mb-2">Broker Sync</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase">Direct MT5 Neural Link</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Select Broker</label>
                        <select className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold appearance-none outline-none focus:border-purple-500 transition-all">
                          <option>IC Markets</option>
                          <option>Pepperstone</option>
                          <option>FTMO Server</option>
                          <option>Custom Server...</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Account ID</label>
                        <input type="text" placeholder="MT5 Number" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                      </div>
                      <button className="w-full py-4 bg-purple-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-500/20">
                        Initialize Sync
                      </button>
                    </div>
                  </div>

                  {/* AI COGNITION FEED */}
                  <div className="lg:col-span-2 bg-white/5 border border-white/5 p-8 rounded-[40px] flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500">
                          <Brain size={20} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest">Neural Insights</h3>
                      </div>
                      <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[11px] leading-relaxed text-white/60 italic">"Current data suggests a high correlation between late-Friday sessions and decreased RR. Consider tightening stops during NY Close."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- BACKTEST VIEW (Point C) --- */}
            {activeTab === 'BACKTEST' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* SIMULATION ENGINE (Point C/2) */}
                  <div className="lg:col-span-1 bg-white/5 border border-white/5 p-8 rounded-[40px] space-y-8">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest mb-2">Neural Simulator</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase">Stress-test your edge</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-10 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-purple-500/40 transition-all cursor-pointer group">
                        <Download size={24} className="text-white/20 group-hover:text-purple-500 transition-colors" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Upload CSV / JSON</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase text-white/40">Confidence Threshold</span>
                          <span className="text-[10px] font-black text-purple-500">85%</span>
                        </div>
                        <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      </div>

                      <button className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-500 hover:text-white transition-all">
                        Run Simulation
                      </button>
                    </div>
                  </div>

                  {/* SIMULATION RESULTS */}
                  <div className="lg:col-span-2 bg-white/5 border border-white/5 p-8 rounded-[40px] flex items-center justify-center border-dashed">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <Activity size={24} className="text-white/10" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Waiting for Data Input...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PLAYBOOK VIEW --- */}
            {activeTab === 'PLAYBOOK' && (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* STRATEGY VAULT (Point D/2) */}
                  <div className="lg:col-span-1 bg-white/5 border border-white/5 p-8 rounded-[40px] space-y-8">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest mb-2">Strategy Vault</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase">Define Your Edge</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Enter New Strategy..." 
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all pr-12"
                        />
                        <button className="absolute right-2 top-2 bottom-2 px-3 bg-white/10 rounded-xl hover:bg-purple-500 transition-all">
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scroll pr-2">
                        {['Mean Reversion', 'Breakout Alpha', 'FVG Expansion'].map((strat) => (
                          <div key={strat} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all cursor-pointer group">
                            <span className="text-[10px] font-black uppercase text-white/60">{strat}</span>
                            <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STRATEGY ANALYTICS PANEL */}
                  <div className="lg:col-span-2 bg-white/5 border border-white/5 p-8 rounded-[40px]">
                  <div className="h-full flex flex-col justify-center items-center border-2 border-dashed border-white/5 rounded-[32px] text-white/10">
                      <BarChart4 size={48} className="mb-4 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Select Strategy for Deep Analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SETTINGS VIEW (Point E) --- */}
            {activeTab === 'SETTINGS' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in fade-in slide-in-from-right-4 duration-700">
                {/* SETTINGS NAV */}
                <div className="lg:col-span-1 space-y-2">
                  {['Account', 'Security', 'Appearance', 'Billing', 'Information'].map((sect) => (
                    <button 
                      key={sect} 
                      onClick={() => setActiveSettingTab(sect)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${activeSettingTab === sect ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{sect}</span>
                      <ChevronRight size={14} className={`transition-transform ${activeSettingTab === sect ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>

                {/* SETTINGS CONTENT */}
                <div className="lg:col-span-3 space-y-8">
                  {/* INFORMATION SECTION (Point E/4) */}
                  {activeSettingTab === 'Information' && (
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] space-y-8">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-1">User Information</h4>
                        <p className="text-[10px] font-bold text-white/20 uppercase">Manage your identity and credentials</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Display Name</label>
                          <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" defaultValue="Harry" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Email Address</label>
                          <input type="email" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" defaultValue="harry@neural.ai" />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">New Password</label>
                          <input type="password" placeholder="••••••••••••" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                        </div>
                      </div>
                      <button className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                        Save Changes
                      </button>
                    </div>
                  )}

                  {/* APPEARANCE SECTION (Point E/2) */}
                  {activeSettingTab === 'Appearance' && (
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] space-y-10">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-1">UI Customization</h4>
                        <p className="text-[10px] font-bold text-white/20 uppercase">Combine themes and neural accents</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <button onClick={() => setTheme({...theme, mode: 'dark'})} className={`flex flex-col items-center gap-4 p-8 rounded-[32px] border transition-all ${theme.mode === 'dark' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black/20 hover:bg-white/5'}`}>
                           <Moon size={24} className={theme.mode === 'dark' ? 'text-purple-500' : 'text-white/20'} />
                           <p className="text-[10px] font-black uppercase tracking-widest">Deep Space (Dark)</p>
                         </button>
                         <button onClick={() => setTheme({...theme, mode: 'light'})} className={`flex flex-col items-center gap-4 p-8 rounded-[32px] border transition-all ${theme.mode === 'light' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black/20 hover:bg-white/5'}`}>
                           <Sun size={24} className={theme.mode === 'light' ? 'text-purple-500' : 'text-white/20'} />
                           <p className="text-[10px] font-black uppercase tracking-widest">Pure Light (Light)</p>
                         </button>
                      </div>
                      <div className="space-y-6">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Accent Palette</p>
                        <div className="flex flex-wrap gap-4">
                          {['#a855f7', '#10b981', '#3b82f6', '#f43f5e', '#f59e0b', '#ec4899', '#ffffff'].map(c => (
                            <button key={c} onClick={() => setTheme({...theme, primary: c})} className={`w-12 h-12 rounded-2xl border-4 transition-transform hover:scale-110 ${theme.primary === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECURITY & 2FA SECTION (Point E/3) */}
                  {activeSettingTab === 'Security' && (
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] space-y-8">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-1">Neural Security</h4>
                        <p className="text-[10px] font-bold text-white/20 uppercase">Protect your terminal access</p>
                      </div>
                      <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Fingerprint size={28} />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase mb-1">Two-Factor Authentication</p>
                            <p className="text-[10px] text-white/40 font-bold uppercase">Strongest protection via Authenticator App</p>
                          </div>
                        </div>
                        <button className="px-8 py-3 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Configure</button>
                      </div>
                    </div>
                  )}

</div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* QUICK LOG MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0A0C10] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Commit Position</h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Manual Ledger Entry</p>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scroll">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Entry Date</label>
                  <input type="date" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all text-white/60" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Asset Pair</label>
                  <input type="text" placeholder="e.g. XAUUSD" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Strategy</label>
                  <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold appearance-none outline-none focus:border-purple-500 transition-all">
                    <option>Mean Reversion</option>
                    <option>Breakout Alpha</option>
                    <option>FVG Expansion</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Position Type</label>
                  <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest">Long</button>
                    <button className="flex-1 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest">Short</button>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-10 border-t border-white/5 bg-black/40 flex gap-6">
              <button 
                onClick={() => setIsLogModalOpen(false)}
                className="flex-1 py-5 rounded-[20px] bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Discard
              </button>
              <button className="flex-[2] py-5 rounded-[20px] bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-purple-500/20">
                Commit to Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setActiveTab('SYLLEDGE')}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <div className="absolute right-full mr-4 px-4 py-2 bg-black border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <p className="text-[8px] font-black uppercase tracking-widest">Ask Sylledge AI</p>
        </div>
      </button>

    </div>
  );
};

export default TradingTerminal;
