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
  const [currentDate, setCurrentDate] = useState(new Date());

  // Appearance Preferences
  const [theme, setTheme] = useState({
    primary: '#a855f7', // Purple Neural
    background: '#020408',
    glowIntensity: 0.15
  });
  const [entryImage, setEntryImage] = useState(null);
const [chartUrl, setChartUrl] = useState('');
const [filters, setFilters] = useState({
  asset: 'ALL',
  strategy: 'ALL',
  direction: 'ALL'
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
  className={`hidden md:flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-500 z-50 fixed left-0 h-full ${
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

            {/* COMMERCIAL_ZONE_SIDEBAR_AD_PLACEHOLDER */}
            {/* Future monetization/sponsor block goes here */}
            </div>
        </aside>
        {/* MOBILE BOTTOM NAVIGATION */}
<nav className="flex md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-2xl border-t border-white/10 z-[100] px-6 py-4 justify-around items-center">
  {[
    { id: 'DASHBOARD', icon: <LayoutDashboard size={20}/> },
    { id: 'SYLLEDGE', icon: <Terminal size={20}/> },
    { id: 'BACKTEST', icon: <Cpu size={20}/> },
    { id: 'PLAYBOOK', icon: <Brain size={20}/> },
    { id: 'SETTINGS', icon: <Settings size={20}/> },
  ].map((item) => (
    <button
      key={item.id}
      onClick={() => setActiveTab(item.id)}
      className={`p-3 rounded-2xl transition-all ${
        activeTab === item.id ? 'bg-purple-500/20 text-purple-500' : 'text-white/40'
      }`}
    >
      {item.icon}
    </button>
  ))}
</nav>

       {/* MAIN CONTENT AREA */}
<main className="flex-1 min-h-screen transition-all duration-500 md:pl-24 lg:pl-24">
  <div className="p-4 md:p-10 pb-32 md:pb-10 max-w-[1600px] mx-auto space-y-10">
          
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
            
              <button 
  onClick={() => setActiveTab('SETTINGS')}
  className="w-12 h-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-[1px] hover:border-purple-500/50 transition-all hover:scale-105 active:scale-95 group"
>
  <div className="w-full h-full rounded-2xl bg-[#020408] flex items-center justify-center overflow-hidden group-hover:bg-purple-500/10 transition-colors">
     <User size={20} className="text-white/40 group-hover:text-purple-500 transition-colors" />
  </div>
</button>
            </div>
          </header>

          {/* DYNAMIC VIEWPORT */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-10 custom-scroll">
            <div className="max-w-[1600px] mx-auto space-y-10">
              
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
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${card.color}`}>
                          {card.label}
                        </div>
                        <div className={`text-4xl font-black italic tracking-tighter mb-2 ${isPrivacyMode ? 'blur-md' : ''}`}>
                          {card.value}
                        </div>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{card.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* DATA VISUALIZATION ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[32px] p-8 h-[450px] relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <TrendingUp size={20} />
                          </div>
                          <h3 className="text-xs font-black uppercase tracking-[0.3em]">Equity Growth Neural Projection</h3>
                        </div>
                        <div className="flex gap-2">
                          {['1D', '1W', '1M', 'ALL'].map(tf => (
                            <button key={tf} className="px-4 py-2 rounded-lg bg-white/5 text-[9px] font-black hover:bg-white/10 transition-all">{tf}</button>
                          ))}
                        </div>
                      </div>
                      <div className={`w-full h-full pb-12 ${isPrivacyMode ? 'blur-2xl' : ''}`}>
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { name: 'Mon', val: 4000 }, { name: 'Tue', val: 3000 }, { name: 'Wed', val: 5500 },
                            { name: 'Thu', val: 4800 }, { name: 'Fri', val: 7000 }, { name: 'Sat', val: 6800 }, { name: 'Sun', val: 9000 }
                          ]}>
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10}} dy={10} />
                            <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                            <Area type="monotone" dataKey="val" stroke={theme.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center relative">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-center">Neural Skill Distribution</h3>
                      <ResponsiveContainer width="100%" height={280}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                          { subject: 'Risk', A: 120, fullMark: 150 }, { subject: 'Timing', A: 98, fullMark: 150 },
                          { subject: 'Edge', A: 86, fullMark: 150 }, { subject: 'Mindset', A: 99, fullMark: 150 },
                          { subject: 'Speed', A: 85, fullMark: 150 }
                        ]}>

<PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#ffffff40', fontSize: 8}} />
                          <Radar name="Skills" dataKey="A" stroke={theme.primary} fill={theme.primary} fillOpacity={0.5} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                        <div className="p-4 bg-white/5 rounded-2xl text-center">
                          <p className="text-[8px] font-bold text-white/30 uppercase mb-1">Consistency</p>
                          <p className="text-sm font-black text-emerald-500">A+</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl text-center">
                          <p className="text-[8px] font-bold text-white/30 uppercase mb-1">Recovery</p>
                          <p className="text-sm font-black text-purple-500">S-Tier</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COMMERCIAL_ZONE_DASHBOARD_MIDDLE_PLACEHOLDER */}
                  {/* Future monetization banner or premium insights carousel goes here */}

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* UPGRADED EXECUTION MATRIX */}
                    <div className="lg:col-span-3 bg-white/5 border border-white/5 rounded-[32px] p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <Calendar size={20} className="text-purple-500" />
                          <h3 className="text-xs font-black uppercase tracking-[0.3em]">Execution Matrix</h3>
                        </div>
                        
                        {/* MONTH NAVIGATION */}
                        <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-2 border border-white/5">
                          <button 
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="hover:text-purple-500 transition-colors"
                          >
                            <ChevronRight size={16} className="rotate-180" />
                          </button>
                          <span className="text-[10px] font-black uppercase tracking-widest min-w-[100px] text-center">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </span>
                          <button 
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="hover:text-purple-500 transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                          </div>
                      </div>

                      {/* CALENDAR GRID */}
                      <div className="grid grid-cols-7 gap-3">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
  <div key={day} className="text-center text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4 bg-white/5 py-2 rounded-lg border border-white/5">
    {day}
  </div>
))}
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
  const day = i + 1;
  const hasTrades = day % 3 === 0; 
  const dailyPnL = hasTrades ? (day % 2 === 0 ? 420 : -150) : 0;
  const tradeCount = hasTrades ? Math.floor(Math.random() * 5) + 1 : 0;

  return (
    <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col justify-between group hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden shadow-inner">
      {/* Day Number - Brighter on hover */}
      <span className="text-[11px] font-black text-white/40 group-hover:text-white transition-colors">
        {day}
      </span>
      
      {hasTrades && (
        <div className="space-y-1.5 relative z-10">
          {/* P&L Badge */}
          <div className={`px-2 py-1 rounded-lg flex items-center justify-center ${dailyPnL >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
             <p className={`text-[10px] font-black tracking-tighter ${dailyPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
               {dailyPnL >= 0 ? `+$${dailyPnL}` : `-$${Math.abs(dailyPnL)}`}
             </p>
          </div>

          {/* Trade Count Badge */}
          <div className="flex items-center gap-1.5 bg-white/5 rounded-md px-1.5 py-0.5 w-fit">
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dailyPnL >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
             <span className="text-[8px] font-black text-white uppercase tracking-tighter">
               {tradeCount} Trades
             </span>
          </div>
        </div>
      )}

      {/* Hover Glow Refined */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${dailyPnL >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
    </div>
  );
})}
                      </div>
                    </div>

                    {/* NEURAL INSIGHTS */}
                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6">Neural Insights</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                           <p className="text-[10px] leading-relaxed text-purple-200">System detects high win-rate during London Open. Consider scaling size by 1.2x.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                           <p className="text-[10px] leading-relaxed text-white/40">Risk of overtrading detected in mid-session. Maintain discipline.</p>
                        </div>
                      </div>
                    </div>
                  </div> {/* Closes the Grid containing Calendar + Insights */}
                </>
              )}
              {activeTab === 'SYLLEDGE' && (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div>
        <h3 className="text-2xl font-black italic tracking-tighter">SYLLEDGE DATA MINE</h3>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Proprietary Execution Log</p>
      </div>

      {/* DYNAMIC FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center bg-white/5 p-2 rounded-[24px] border border-white/5">
        <div className="flex flex-col px-4">
          <label className="text-[7px] font-black uppercase text-purple-500 mb-1">Asset</label>
          <select 
            value={filters.asset}
            onChange={(e) => setFilters({...filters, asset: e.target.value})}
            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
          >
            <option value="ALL">All Assets</option>
            <option value="XAUUSD">XAUUSD</option>
            <option value="GER30">GER30</option>
            <option value="NAS100">NAS100</option>
          </select>
        </div>
        
        <div className="w-[1px] h-8 bg-white/10" />

        <div className="flex flex-col px-4">
          <label className="text-[7px] font-black uppercase text-purple-500 mb-1">Strategy</label>
          <select 
            value={filters.strategy}
            onChange={(e) => setFilters({...filters, strategy: e.target.value})}
            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
          >
            <option value="ALL">All Plays</option>
            <option value="SILVER_BULLET">Silver Bullet</option>
            <option value="LIQUIDITY">Liquidity Grab</option>
          </select>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        <div className="flex flex-col px-4">
          <label className="text-[7px] font-black uppercase text-purple-500 mb-1">Direction</label>
          <select 
            value={filters.direction}
            onChange={(e) => setFilters({...filters, direction: e.target.value})}
            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
          >
            <option value="ALL">Overall</option>
            <option value="LONG">Longs Only</option>
            <option value="SHORT">Shorts Only</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2">
          <Database size={14} /> Sync MT5
        </button>
      </div>
    </div>

    {/* SUB-VISUALIZATION: MINI KPI CARDS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Edge Score', val: '88%', sub: filters.asset },
        { label: 'Profit Factor', val: '2.4', sub: filters.strategy },
        { label: 'Avg RR', val: '1:3.2', sub: 'Calculated' },
        { label: 'Expectancy', val: '$420', sub: 'Per Trade' }
      ].map((stat, i) => (
        <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl">
          <p className="text-[7px] font-black text-purple-500 uppercase tracking-widest mb-1">{stat.label}</p>
          <p className="text-xl font-black italic tracking-tighter">{stat.val}</p>
          <p className="text-[8px] font-bold text-white/20 uppercase mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>

    {/* TABLE SECTION */}
    <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/5">
            {['Asset', 'Type', 'Entry', 'Size', 'PnL', 'Status', 'Insights'].map((head) => (
              <th key={head} className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{head}</th>
            ))}
          </tr>
        </thead>
        {/* Table Body would go here */}
      </table>
    </div>
  </div>
)}
              {activeTab === 'BACKTEST' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Simulation Engine</h3>
                        <div className="space-y-6">
                          <div>
                            <label className="text-[8px] font-black uppercase text-white/30 tracking-widest block mb-3">Strategy Logic</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold outline-none focus:border-purple-500 transition-all">
                              <option>Mean Reversion v4.2</option>
                              <option>Liquidity Sweep Alpha</option>
                              <option>Neural Trend Follower</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[8px] font-black uppercase text-white/30 tracking-widest block mb-3">Sample Size</label>
                              <input type="text" defaultValue="500 Trades" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold outline-none focus:border-purple-500 transition-all" />
                            </div>
                            <div>
                              <label className="text-[8px] font-black uppercase text-white/30 tracking-widest block mb-3">Risk Per Op</label>
                              <input type="text" defaultValue="1.5%" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold outline-none focus:border-purple-500 transition-all" />
                            </div>
                          </div>
                          <button className="w-full py-4 bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                            Run Simulation
                          </button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/20 rounded-[32px] p-8">
                         <div className="flex items-center gap-3 mb-4">
                            <Brain size={18} className="text-purple-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Neural Projection</h4>
                         </div>
                         <p className="text-[10px] text-purple-200/60 leading-relaxed">Based on current volatility, this strategy has a 68% probability of maintaining its Sharpe ratio over the next 100 iterations.</p>
                      </div>
                    </div>
                    <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[32px] p-8 h-[600px] flex flex-col">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <Cpu size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em]">Probabilistic Outcome Curve</h3>
                          </div>
                       </div>
                       <div className="flex-1 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { x: 0, y: 0 }, { x: 10, y: 5 }, { x: 20, y: 15 }, { x: 30, y: 12 },
                              { x: 40, y: 25 }, { x: 50, y: 40 }, { x: 60, y: 38 }, { x: 70, y: 55 },
                              { x: 80, y: 70 }, { x: 90, y: 65 }, { x: 100, y: 85 }
                            ]}>
                              <XAxis dataKey="x" hide />
                              <YAxis hide />
                              <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                              <Line type="monotone" dataKey="y" stroke={theme.primary} strokeWidth={4} dot={false} shadow="0 0 20px rgba(168,85,247,0.5)" />
                            </LineChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="grid grid-cols-3 gap-4 mt-8">
                          <div className="text-center p-4 bg-white/5 rounded-2xl">
                             <p className="text-[8px] font-bold text-white/20 uppercase mb-1">Expectancy</p>
                             <p className="text-sm font-black text-white">$420/trade</p>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-2xl">
                             <p className="text-[8px] font-bold text-white/20 uppercase mb-1">Max DD</p>
                             <p className="text-sm font-black text-rose-500">8.4%</p>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-2xl">
                             <p className="text-[8px] font-bold text-white/20 uppercase mb-1">Recovery</p>
                             <p className="text-sm font-black text-emerald-500">12 Days</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PLAYBOOK' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {[
                    { title: 'The Silver Bullet', grade: 'S-Tier', rules: 5, edge: '92%', color: 'border-purple-500/50' },
                    { title: 'Liquidity Grab', grade: 'A+', rules: 4, edge: '84%', color: 'border-blue-500/50' },
                    { title: 'Catalyst Break', grade: 'B', rules: 6, edge: '71%', color: 'border-white/10' },
                  ].map((play, i) => (
                    <div key={i} className={`bg-white/5 border ${play.color} rounded-[32px] p-8 group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden`}>
                      <div className="flex justify-between items-start mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Brain size={24} className="text-white/40 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] font-black px-3 py-1 bg-white text-black rounded-lg uppercase tracking-tighter">{play.grade}</span>
                      </div>
                      <h4 className="text-xl font-black italic tracking-tighter mb-2">{play.title}</h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Systematic Edge: {play.edge}</p>
                      
                      <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-white/60">Rule Validation 0{j+1} Passed</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{play.rules} Rules Active</span>
                        <ChevronRight size={16} className="text-white/20" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'SETTINGS' && (
                <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Identity Profile</h3>
                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                            <div className="w-full h-full rounded-[22px] bg-black flex items-center justify-center">
                               <User size={32} />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-black italic tracking-tight">Neural_User_771</p>
                            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Elite Tier Active</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <button className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-left flex justify-between">
                            Edit Alias <ChevronRight size={14} />
                          </button>
                          <button className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-left flex justify-between">
                            Privacy Settings <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                        <div className="flex items-center gap-3 mb-8">
                           <ShieldCheck size={18} className="text-emerald-500" />
                           <h3 className="text-xs font-black uppercase tracking-[0.3em]">Security Matrix</h3>
                        </div>
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-white/40 uppercase">Two-Factor Auth</span>
                              <div className="w-10 h-5 bg-purple-500 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"/></div>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-white/40 uppercase">API Encryption</span>
                              <span className="text-[10px] font-black text-emerald-500">AES-256</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                      <div className="flex items-center gap-3 mb-8">
                         <Palette size={18} className="text-purple-500" />
                         <h3 className="text-xs font-black uppercase tracking-[0.3em]">Neural Aesthetic</h3>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        {['#a855f7', '#3b82f6', '#10b981', '#f43f5e'].map(color => (
                          <button 
                            key={color}
                            onClick={() => setTheme({...theme, primary: color})}
                            className="aspect-square rounded-xl border-2 border-white/5 transition-all hover:scale-105"
                            style={{ backgroundColor: color, borderColor: theme.primary === color ? 'white' : 'transparent' }}
                          />
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Glow Intensity</span>
                          <span className="text-[10px] font-black text-white">{(theme.glowIntensity * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="0.5" step="0.01" 
                          value={theme.glowIntensity}
                          onChange={(e) => setTheme({...theme, glowIntensity: parseFloat(e.target.value)})}
                          className="w-full accent-purple-500" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

     {/* --- 5. NEURAL ENTRY MODAL --- */}
     {isLogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setIsLogModalOpen(false)} />
            <div className="relative w-full max-w-6xl bg-[#020408] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col max-h-[95vh]">
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter">COMMIT NEW POSITION</h3>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Neural Validation Active</p>
                </div>
                <button onClick={() => setIsLogModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scroll">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* LEFT COLUMN: PRIMARY METRICS */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Trade Date</label>
                        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-purple-500 transition-all [color-scheme:dark]" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Strategy / Playbook</label>
                        <input type="text" placeholder="e.g. Silver Bullet" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Instrument</label>
                        <input type="text" placeholder="e.g. XAUUSD" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Position Size</label>
                        <input type="text" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Entry Price</label>
                        <input type="number" step="any" placeholder="0.00000" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Exit Price</label>
                        <input type="number" step="any" placeholder="0.00000" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Risk : Reward Ratio</label>
                      <input type="text" placeholder="e.g. 1:3.5" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Entry Thesis</label>
                      <textarea rows={3} placeholder="Describe the neural confluence..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all resize-none" />
                    </div>
                  </div>

                  {/* RIGHT COLUMN: VISION & PSYCHOLOGY */}
                  <div className="space-y-8">
                  <div className="space-y-4">
    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block">Market Vision (Image or URL)</label>
                    {/* 1. Functional Image Upload Box */}
    <div 
      onClick={() => document.getElementById('imageUpload').click()}
      className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center group hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden"
    >
      {entryImage ? (
        <img src={entryImage} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <>
          <ImageIcon size={32} className="text-white/20 group-hover:text-purple-500 transition-colors mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Click to Upload Chart</p>
        </>
        )}
        <input 
          id="imageUpload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setEntryImage(URL.createObjectURL(file));
          }} 
        />
      </div>

      {/* 2. New URL Input Field */}
    <div className="relative group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Globe size={14} className="text-white/20 group-focus-within:text-purple-500 transition-colors" />
      </div>
      <input 
        type="text" 
        placeholder="Or paste TradingView/Chart URL..." 
        value={chartUrl}
        onChange={(e) => setChartUrl(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-12 text-sm font-bold outline-none focus:border-purple-500 transition-all" 
      />
    </div>
  </div>

                    <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block">Mindset Tags</label>
                      <div className="flex flex-wrap gap-3">
                        {['Disciplined', 'FOMO', 'Aggressive', 'Zen', 'Revenge'].map(tag => (
                          <button key={tag} className="px-4 py-2 bg-white/5 rounded-lg text-[8px] font-black uppercase border border-white/5 hover:border-purple-500 transition-all">
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Psychological Narrative</label>
                      <textarea rows={6} placeholder="Detailed state of mind during execution..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all resize-none" />
                    </div>
                    </div>
                </div>
              </div>

             

              <div className="p-10 border-t border-white/5 flex gap-6 bg-white/[0.02]">
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
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 pointer-events-none" />
        </button>

        </div>
      </main> 
    </div> 
  </div> 
  );
};

export default TradingTerminal;