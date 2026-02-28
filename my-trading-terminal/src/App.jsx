"use client";

import React, { useState, useEffect } from 'react';

// import { supabase } from '../supabaseClient';
import { supabase } from '../supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, BarChart, Bar, Cell
} from 'recharts';
import {
  Plus, X, Zap, Cpu, Settings, Brain, Terminal,
  Fingerprint, Activity, Target, Sparkles,
  TrendingUp, User, ChevronRight, Moon, Sun, 
  Menu, Download, Info, ImageIcon, Upload, Camera,
  ShieldCheck, CreditCard, Globe, Lock, History, Database, Palette
} from 'lucide-react';

const TradingTerminal = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [activeSettingTab, setActiveSettingTab] = useState('Account'); 
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [strategies, setStrategies] = useState(['Mean Reversion', 'FVG Expansion']);
  const [newStrategyName, setNewStrategyName] = useState('');
  
  
  const [theme, setTheme] = useState({
    primary: '#a855f7',
    background: '#020408',
    mode: 'dark'
  });

  // Persistence: Save Theme to LocalStorage
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('terminal_theme', JSON.stringify(theme));
      document.documentElement.style.setProperty('--primary-glow', theme.primary);
    }
  }, [theme, hasMounted]);

  // Strategy Vault Logic
  const addStrategy = () => {
    if (newStrategyName.trim() !== '') {
      setStrategies([...strategies, newStrategyName]);
      setNewStrategyName('');
    }
  };

  const [passwordState, setPasswordState] = useState({ current: '', next: '', confirm: '' });
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const brokerProtocols = [
    { id: 'MT5_DIRECT', label: 'MT5 Direct API', desc: 'Native C++ / Python Bridge' },
    { id: 'META_API', label: 'MetaApi.cloud', desc: 'REST/WebSocket Cloud Bridge' },
    { id: 'LOCAL_NODE', label: 'Local Node Sync', desc: 'JSON-based Terminal Listener' }
  ];
  const [selectedProtocol, setSelectedProtocol] = useState('MT5_DIRECT');

  useEffect(() => {
    setHasMounted(true);
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme) setTheme(JSON.parse(savedTheme));
  }, []);
  // if (!hasMounted) return null;
  const TerminalStyles = () => (
    <style jsx global>{`
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
      }
      .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
      .custom-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb:hover { background: ${theme.primary}; }
      .neural-grid {
        background-size: 40px 40px;
        background-image: 
          linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
      }
      .glass-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
    `}</style>
  );

  return (
    <div className="relative z-10 flex h-screen overflow-hidden text-white font-sans transition-colors duration-500" style={{ backgroundColor: theme.background }}>
      <TerminalStyles />
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Zap size={18} style={{ color: theme.primary }} className="fill-current" />
          <span className="text-xs font-black italic tracking-tighter uppercase">Neural Terminal</span>
        </div>
        <button onClick={toggleMobileMenu} className="text-white/60">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* MOBILE NAV OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black z-[55] pt-24 px-6 space-y-2 animate-in fade-in slide-in-from-top-4">
          {[
            { id: 'DASHBOARD', icon: <Activity size={20}/>, label: 'Dashboard' },
            { id: 'SYLLEDGE', icon: <Brain size={20}/>, label: 'Sylledge AI' },
            { id: 'BACKTEST', icon: <Cpu size={20}/>, label: 'Backtesting' },
            { id: 'PLAYBOOK', icon: <Target size={20}/>, label: 'Playbook' },
            { id: 'SETTINGS', icon: <Settings size={20}/>, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-6 p-5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white/5 text-purple-500' : 'text-white/40'}`}
            >
              {item.icon}
              <span className="text-[10px] font-black tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside 
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`hidden lg:flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-500 z-50 ${isSidebarExpanded ? 'w-80' : 'w-24'}`}
      >
        <div className="flex flex-col h-full py-10 px-6">
          <div className="flex items-center gap-4 mb-16 overflow-hidden">
            <div className="min-w-[48px] h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
              <Zap size={24} className="text-white fill-white" />
            </div>
            <div className={`transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-xl font-black italic tracking-tighter leading-none uppercase">Neural</h1>
              <p className="text-[7px] font-bold tracking-[0.4em] mt-1 uppercase" style={{ color: theme.primary }}>Terminal Elite</p>
            </div>
          </div>
          <nav className="space-y-4 flex-1">
            {[
              { id: 'DASHBOARD', icon: <Activity size={20}/>, label: 'Dashboard' },
              { id: 'SYLLEDGE', icon: <Brain size={20}/>, label: 'Sylledge AI' },
              { id: 'BACKTEST', icon: <Cpu size={20}/>, label: 'Backtesting' },
              { id: 'PLAYBOOK', icon: <Target size={20}/>, label: 'Playbook' },
              { id: 'SETTINGS', icon: <Settings size={20}/>, label: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-6 p-4 rounded-2xl transition-all relative group ${activeTab === item.id ? 'bg-white/5' : 'text-white/40 hover:text-white'}`}
                style={{ color: activeTab === item.id ? theme.primary : '' }}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pt-16 lg:pt-0">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-black/20 backdrop-blur-md relative z-20">
          <h2 className="text-[10px] lg:text-sm font-black uppercase tracking-widest italic">{activeTab}</h2>

          <div className="flex items-center gap-3 lg:gap-6">
            <button 
              onClick={() => setIsLogModalOpen(true)} 
              className="flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-3 lg:py-4 bg-white text-black rounded-xl lg:rounded-2xl transition-all hover:scale-105 shadow-xl"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest">New Position</span>
            </button>
            <button 
              onClick={() => { setActiveTab('SETTINGS'); setActiveSettingTab('Account'); }} 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl border border-white/10 flex items-center justify-center hover:border-purple-500 transition-all group"
            >
              <User size={18} className="text-white/40 group-hover:text-purple-500" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scroll">
          <div className="max-w-[1600px] mx-auto space-y-10">
            {activeTab === 'DASHBOARD' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
                  {[
                    { label: 'Neural Alpha', value: '94.2%', color: theme.primary },
                    { label: 'P&L (Net)', value: '$12,450', color: '#10b981' },
                    { label: 'Win Rate', value: '74.2%', color: '#3b82f6' },
                    { label: 'Drawdown', value: '1.2%', color: '#f43f5e' }
                  ].map((card, i) => (
                    <div key={i} className="glass-card p-8 rounded-[32px] group hover:border-white/20 transition-all">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-4">{card.label}</p>
                      <div className="text-3xl font-black italic tracking-tighter" style={{ color: card.color }}>{card.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
                  <div className="glass-card p-6 lg:p-8 rounded-[40px] flex flex-col items-center">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-8 self-start flex items-center gap-2">
                       <Target size={14} style={{ color: theme.primary }} /> Performance DNA
                    </h3>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={[{s: 'Win %', A: 85}, {s: 'RR', A: 70}, {s: 'Psych', A: 90}, {s: 'Risk', A: 75}, {s: 'Timing', A: 60}]}>
                          <PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis dataKey="s" tick={{fill: '#ffffff40', fontSize: 8}} />
                          <Radar dataKey="A" stroke={theme.primary} fill={theme.primary} fillOpacity={0.5} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="xl:col-span-2 glass-card p-6 lg:p-10 rounded-[40px] h-[400px] lg:h-[510px]">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-[10px] lg:text-sm font-black uppercase tracking-widest">Equity Growth Curve</h3>
                       <div className="hidden sm:flex bg-black/40 p-1 rounded-xl border border-white/5">
                        {['1D', '1W', '1M', 'ALL'].map(tf => <button key={tf} className="px-3 py-1 text-[8px] font-black text-white/30 hover:text-white transition-all">{tf}</button>)}
                       </div>
                    </div>
                    <div className="h-64 lg:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[{n: 'W1', v: 4000}, {n: 'W2', v: 3000}, {n: 'W3', v: 5000}, {n: 'W4', v: 4500}, {n: 'W5', v: 7000}, {n: 'W6', v: 12450}]}>
                          <defs><linearGradient id="pG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={theme.primary} stopOpacity={0}/></linearGradient></defs>
                          <Area type="monotone" dataKey="v" stroke={theme.primary} fill="url(#pG)" strokeWidth={4} />
                          <Tooltip contentStyle={{backgroundColor: '#0a0c10', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px'}} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
                
            {activeTab === 'SYLLEDGE' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="glass-card p-6 lg:p-10 rounded-[40px] space-y-8">
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Neural Broker Sync</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select your synchronization protocol</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {brokerProtocols.map((protocol) => (
                      <button 
                        key={protocol.id}
                        onClick={() => setSelectedProtocol(protocol.id)}
                        className={`p-6 rounded-[32px] border transition-all text-left space-y-4 group ${selectedProtocol === protocol.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black/20 hover:bg-white/5'}`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedProtocol === protocol.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/20'}`}>
                          <Database size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1">{protocol.label}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase leading-tight">{protocol.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Broker Server / URL</label>
                      <input type="text" placeholder="mt5.broker-api.com" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">API Key / Access Token</label>
                      <div className="relative">
                        <input type="password" placeholder="••••••••••••••••" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all pr-12" />
                        <Lock className="absolute right-4 top-4 text-white/20" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="flex-1 bg-purple-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Initialize Neural Link
                    </button>
                    <div className="flex items-center gap-4 px-6 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Status: Disconnected</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-8 rounded-[40px] space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <History size={14} className="text-purple-500" /> Recent Sync Logs
                    </h4>
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-[9px] font-bold text-white/40">Ping to {selectedProtocol}</span>
                          <span className="text-[8px] font-black text-rose-500 uppercase">Failed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'BACKTEST' && (
              <div className="space-y-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="glass-card p-10 rounded-[40px] space-y-6">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Neural Simulation</h3>
                  <p className="text-[11px] leading-relaxed text-white/50 font-medium">
                    The AI Backtest engine processes historical price action against your specific 
                    <span className="text-purple-500"> Playbook Strategies</span>. By uploading visual 
                    evidence (Screenshots) or data logs (CSV), the neural network identifies 
                    high-probability clusters and execution leaks in your mechanical edge.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-purple-500 mb-1">Confidence Factor</p>
                      <p className="text-lg font-black italic">89.4%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-emerald-500 mb-1">Alpha Leakage</p>
                      <p className="text-lg font-black italic">2.1%</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-10 rounded-[40px] flex flex-col items-center justify-center border-dashed border-2 border-white/10 group hover:border-purple-500/50 transition-all">
                  <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-purple-500" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Upload Research Data</h4>
                    <p className="text-[9px] text-white/30 uppercase font-bold text-center px-10">Drag & Drop MT5 Statements or Setup Screenshots</p>
                    <input type="file" className="hidden" id="backtest-upload" />
                    <button onClick={() => document.getElementById('backtest-upload').click()} className="mt-6 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10">Browse Files</button>
                  </div>
                </div>
                <div className="glass-card p-8 lg:p-10 rounded-[40px]">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Simulation Output</h4>
                    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-2/3 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-48 flex items-center justify-center border border-white/5 rounded-3xl bg-black/20">
                    <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.3em]">Waiting for Data Stream...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PLAYBOOK' && (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="glass-card p-10 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8">
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Neural Strategy Vault</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Define and deploy mechanical edges</p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <input 
                      type="text" 
                      value={newStrategyName}
                      onChange={(e) => setNewStrategyName(e.target.value)}
                      placeholder="Strategy Name..." 
                      className="flex-1 md:w-64 bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" 
                    />
                    <button onClick={addStrategy} className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase hover:scale-105 transition-all">Add</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {strategies.map((strat, i) => (
                    <div key={i} className="glass-card p-8 rounded-[40px] group hover:border-purple-500/30 transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                      </div>
                      <div className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                          <Target size={20} className="text-white/20 group-hover:text-purple-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tight mb-1">{strat}</h4>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Mechanical Alpha v1.0</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[7px] font-black text-white/20 uppercase mb-1">Win Rate</p>
                            <p className="text-[11px] font-black italic text-emerald-500">68.2%</p>
                          </div>
                          <div>
                            <p className="text-[7px] font-black text-white/20 uppercase mb-1">Neural Score</p>
                            <p className="text-[11px] font-black italic text-purple-500">92/100</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'SETTINGS' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 animate-in fade-in duration-700">
                <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                  {['Account', 'Security', 'Appearance', 'Billing', 'Information'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setActiveSettingTab(s)} 
                      className={`whitespace-nowrap flex-1 lg:flex-none p-4 lg:p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left transition-all ${activeSettingTab === s ? 'bg-purple-500 shadow-lg shadow-purple-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-3 space-y-6">
                {activeSettingTab === 'Account' && (
                    <div className="glass-card p-10 rounded-[40px] space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center relative group overflow-hidden">
                          <User size={40} className="text-white/20" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                            <Plus size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-black italic uppercase tracking-tighter">Trader Profile</h3>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Neural ID: #TR-88429</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Display Name</label>
                          <input type="text" placeholder="Quantum_Alpha" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Email Protocol</label>
                          <input type="email" placeholder="alpha@neural-terminal.io" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingTab === 'Appearance' && (
                    <div className="glass-card p-10 rounded-[40px] space-y-8">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">UI Core Engine</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Primary Neural Tint</p>
                          <div className="flex gap-4">
                            {['#a855f7', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b'].map(color => (
                              <button 
                                key={color}
                                onClick={() => setTheme({...theme, primary: color})}
                                className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${theme.primary === color ? 'ring-2 ring-white ring-offset-4 ring-offset-black' : ''}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Interface Density</p>
                          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
                            {['COMPACT', 'RELAXED'].map(d => (
                              <button key={d} className={`flex-1 py-3 text-[8px] font-black rounded-xl transition-all ${d === 'COMPACT' ? 'bg-white/10 text-white' : 'text-white/30'}`}>{d}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingTab === 'Information' && (
                    <div className="glass-card p-10 rounded-[40px] space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-500">
                          <Zap size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black italic uppercase tracking-tighter">System Diagnostics</h3>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Version 4.0.2-Stable</p>
                        </div>
                      </div>
                      <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-white/30">Network Latency</span>
                          <span className="text-emerald-500">12ms</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-white/30">Encryption Protocol</span>
                          <span className="text-white">AES-256-GCM</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-white/30">Neural Engine</span>
                          <span className="text-purple-500">Llama-3-Neural-V2</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: NEW POSITION LOG */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsLogModalOpen(false)} />
          <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[48px] relative z-10 p-8 lg:p-12 custom-scroll animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Log Position</h2>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Archive execution data to neural vault</p>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Instrument / Symbol</label>
                  <input type="text" placeholder="XAUUSD" className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Bias</label>
                    <div className="flex bg-white/5 p-1 rounded-[20px] border border-white/5">
                      <button className="flex-1 py-3 text-[9px] font-black rounded-xl bg-emerald-500 text-black">LONG</button>
                      <button className="flex-1 py-3 text-[9px] font-black rounded-xl text-white/30">SHORT</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Result</label>
                    <div className="flex bg-white/5 p-1 rounded-[20px] border border-white/5">
                      <button className="flex-1 py-3 text-[9px] font-black rounded-xl bg-purple-500 text-white">WIN</button>
                      <button className="flex-1 py-3 text-[9px] font-black rounded-xl text-white/30">LOSS</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Risk (%)</label>
                    <input type="number" placeholder="1.0" className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">RR Ratio</label>
                    <input type="number" placeholder="2.5" className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-sm font-bold outline-none focus:border-purple-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Applied Strategy (Playbook)</label>
                  <select className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-sm font-bold outline-none focus:border-purple-500 transition-all appearance-none">
                    {strategies.map(s => <option key={s} className="bg-neutral-900">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Execution Narrative</label>
                  <textarea 
                    placeholder="Describe the neural logic behind this entry..." 
                    className="w-full h-40 bg-white/5 border border-white/10 p-6 rounded-[32px] text-sm font-bold outline-none focus:border-purple-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Visual Evidence (Chart)</label>
                  <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center group hover:border-purple-500/50 transition-all cursor-pointer">
                    <Plus size={24} className="text-white/20 group-hover:text-purple-500 mb-2" />
                    <span className="text-[8px] font-black uppercase text-white/20">Attach Screenshot</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsLogModalOpen(false)}
                    className="flex-1 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    className="flex-[2] py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest bg-purple-500 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Confirm Neural Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STYLES FOR ANIMATIONS & SCROLL */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};



export default TradingTerminal;