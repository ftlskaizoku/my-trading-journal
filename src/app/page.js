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
  Wallet, Gauge, Database, MessageSquare, Briefcase, Menu, Search, 
  Download, Upload // Added Upload here
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
  const [liveAccountData, setLiveAccountData] = useState(null);
const [isSyncing, setIsSyncing] = useState(false);
const [strategyRules, setStrategyRules] = useState({
  maxDrawdown: 5,
  minRR: 2,
  maxTradesPerDay: 3,
  stopLossRequired: true
});
const [customPlaybook, setCustomPlaybook] = useState([]);
const [newStrategy, setNewStrategy] = useState({ 
  name: '', 
  rules: '', 
  timeframe: '1H',
  gradingCriteria: {
    aplus: '',
    a: '',
    bplus: '',
    b: ''
  },
  sampleImage: null 
});
const [isCreatingStrategy, setIsCreatingStrategy] = useState(false);
  const [chartData, setChartData] = useState([
    { name: 'Mon', val: 4000 }, { name: 'Tue', val: 3000 }, { name: 'Wed', val: 5500 },
    { name: 'Thu', val: 4800 }, { name: 'Fri', val: 7000 }, { name: 'Sat', val: 6800 }, { name: 'Sun', val: 9000 }
  ]);
  const [selectedGrade, setSelectedGrade] = useState('A');// Default to A
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState('ACCOUNT');
  const radarData = useMemo(() => {
    if (!chartData || chartData.length < 2) {
      return [
        { subject: 'Risk', A: 120, fullMark: 150 }, { subject: 'Timing', A: 98, fullMark: 150 },
        { subject: 'Edge', A: 86, fullMark: 150 }, { subject: 'Mindset', A: 99, fullMark: 150 },
        { subject: 'Speed', A: 85, fullMark: 150 }
      ];
    }

    // Simple Logic: Higher Profit/Loss consistency increases the "Edge" score
    const totalProfit = chartData.reduce((sum, item) => sum + item.val, 0);
    const winRate = (chartData.filter(item => item.val > 0).length / chartData.length) * 150;
    
    return [
      { subject: 'Risk', A: 110, fullMark: 150 },
      { subject: 'Timing', A: 95, fullMark: 150 },
      { subject: 'Edge', A: Math.min(winRate, 150), fullMark: 150 },
      { subject: 'Mindset', A: 105, fullMark: 150 },
      { subject: 'Speed', A: 90, fullMark: 150 }
    ];
  }, [chartData]);
  const [strategyNarrative, setStrategyNarrative] = useState('');
const [entryImage, setEntryImage] = useState(null);
const [lastTradePnl, setLastTradePnl] = useState(0); // For manual PnL entry
const [chartUrl, setChartUrl] = useState('');
const [filters, setFilters] = useState({
  asset: 'ALL',
  strategy: 'ALL',
  direction: 'ALL'
});

const [appearance, setAppearance] = useState({
  mode: 'dark',
  primaryColor: '#a855f7', // Default Purple
  glowIntensity: 0.5
});

// This effect updates the "brand color" across the whole app instantly
useEffect(() => {
  document.documentElement.style.setProperty('--brand-primary', appearance.primaryColor);
  document.documentElement.style.setProperty('--brand-glow', `${appearance.primaryColor}66`); // 40% opacity for glow
}, [appearance.primaryColor]);
useEffect(() => {
  // Load saved appearance on mount
  const saved = localStorage.getItem('sylledge_appearance');
  if (saved) {
    setAppearance(JSON.parse(saved));
  }
  setHasMounted(true);
}, []);

const syncLiveMT5 = async () => {
  setIsSyncing(true);
  try {
    // Replace these with your actual keys from MetaApi
    const API_TOKEN = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhOWM2NDIyMTU2YTA0MTUzZTY1MDgyMTgzODMwNjE5ZSIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVzdC1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJtZXRhc3RhdHMtYXBpIiwibWV0aG9kcyI6WyJtZXRhc3RhdHMtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibXQtbWFuYWdlci1hcGkiLCJtZXRob2RzIjpbIm10LW1hbmFnZXItYXBpOnJlc3Q6ZGVhbGluZzoqOioiLCJtdC1tYW5hZ2VyLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJiaWxsaW5nLWFwaSIsIm1ldGhvZHMiOlsiYmlsbGluZy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfV0sImlnbm9yZVJhdGVMaW1pdHMiOmZhbHNlLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiYTljNjQyMjE1NmEwNDE1M2U2NTA4MjE4MzgzMDYxOWUiLCJpYXQiOjE3NzIyODM5OTR9.kytOcIVkTj6iQThm97_UGIuR4iJ3jB-3lPqj-Ch-XqWKo61ZkhCsbLB2vY4LUzRww7xTDHzpOf5YFHK0My2YecVChYAfLUz6frmhXrd72wzsC1mdKsMrthPpLnzB2Gwn3ryCip3TS3MgJgZtWBgbA-gaYCAmKMzr7KIHDh3UYkXRHnZ4cp-v9rmnlYkT_Teqz-Onl9zWL5mtHzGMmtfdnK9MOmskhrErCWH4PdLzZCFgF3Rj5Cx8M08G9hvNioQGOu_nv8nGQnBk6ID18b7ULQGnr-yFqOqwneoJb1Heb-rCrfslgWwXS3wxDjNlqGD1Da-onZCL6mfkAX4tqj8wfzKrhjMnUGzDnCmnGUAsOHHgwlvY_WAIWUsDu9wZan-HvCi5_qj49Fhy92KGViuKCqsTaTrpCJ05LWnmZhB_mr5yvVHYBP3v1m5jyNTPBICNcI0bQZUmSDoqV3X9coK9qb5AnaWZPKKrgOgwJK3VjzNCHdALMtAQzzbmy6yaQkh5Swc8gan74nAOa_Tkjy_O7OQ_Gqi3j6a8BaD3y5tDhit-U7w79abWHFXgmt-fao9v5o07WUQpaL76NS2h-bblkD6F347yM-zXBMgo8ZtzTnb--Lwl3PDVqxgSOPyO2QNNeKDXNxYJo9M-5A49H8a5EUyjFzD0rlHb75BcTuvWmDk'; 
    const ACCOUNT_ID = '351af058-646e-47c7-98bb-5b892ff07829';

    // This fetches your filled trade history
    const response = await fetch(
      `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${ACCOUNT_ID}/history-orders/filled?from=2025-01-01T00:00:00.000Z&to=2026-12-31T23:59:59.999Z`, 
      { 
        headers: { 'auth-token': API_TOKEN },
        method: 'GET'
      }
    );
  
    // NEW GUARD: Handle the "Not Deployed" 404 error gracefully
    if (response.status === 404) {
      alert("Neural Bridge Offline: Please ensure your account is 'DEPLOYED' in the MetaApi Dashboard.");
      setIsSyncing(false);
      return;
    }

    if (!response.ok) throw new Error('Neural Link Failed');
    
    const data = await response.json();
    

    // Convert MT5 data into your Chart format
    const liveTrades = data.map((trade) => ({
      name: new Date(trade.doneTime).toLocaleDateString('en-US', { weekday: 'short' }),
      val: trade.profit // Profit/Loss value
    }));

    if (liveTrades.length > 0) {
      setChartData(liveTrades);
    }
    
    setIsSyncing(false);
  } catch (error) {
    console.error("Sync Error:", error);
    setIsSyncing(false);
  }
};
// Add these to your existing state definitions
const [profile, setProfile] = useState({ name: 'Neural Trader', email: 'elite@sylledge.ai', bio: '' });
const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true });
const [preferences, setPreferences] = useState({ language: 'EN', timezone: 'UTC', currency: 'USD' });


const handleSyncSettings = () => {
  setIsSyncing(true);
  
  // Save to LocalStorage so it stays when you refresh
  localStorage.setItem('sylledge_appearance', JSON.stringify(appearance));
  
  // Simulate a cloud sync delay
  setTimeout(() => {
    setIsSyncing(false);
  }, 1500);
};

// --- HELPER: Upload to Supabase Storage ---
const uploadToSupabase = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `setups/${fileName}`;

  let { error: uploadError } = await supabase.storage
    .from('trading-images') // Ensure this bucket exists in your Supabase Dashboard
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('trading-images').getPublicUrl(filePath);
  return data.publicUrl;
};
const handleSaveStrategy = async () => {
  const { data, error } = await supabase
    .from('playbook')
    .insert([{ 
      name: newStrategy.name, 
      rules: newStrategy.rules, 
      timeframe: newStrategy.timeframe 
    }]);

  if (!error) {
    setCustomPlaybook([...customPlaybook, newStrategy]);
    setIsCreatingStrategy(false);
    setNewStrategy({ name: '', rules: '', timeframe: '1H' });
  }
};
const handleCommitTrade = async () => {
  try {
    let imageUrl = null;

    const handleSyncSettings = () => {
      setIsSyncing(true);
      
      // Save to LocalStorage for persistence
      localStorage.setItem('sylledge_appearance', JSON.stringify(appearance));
      
      // Simulate cloud sync delay
      setTimeout(() => {
        setIsSyncing(false);
        alert("Neural Configuration Synced Successfully.");
      }, 1000);
    };

    // 1. Upload image to Supabase Storage if it exists
    if (entryImage) {
      const fileExt = entryImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `setups/${fileName}`;

      

      const { error: uploadError } = await supabase.storage
        .from('trading-images')
        .upload(filePath, entryImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('trading-images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    // 2. Insert the full record into the Supabase Database
    const { error } = await supabase.from('trades').insert([{
      asset: filters.asset,
      strategy_name: filters.strategy,
      narrative: strategyNarrative,
      image_url: imageUrl,
      pnl: lastTradePnl,
      timestamp: new Date()
    }]);

    if (error) throw error;

    // 3. Success: Close modal and reset
    setIsLogModalOpen(false);
    setStrategyNarrative('');
    setEntryImage(null);
    alert("Neural Link Established: Strategy Stored.");

  } catch (err) {
    console.error("Storage Error:", err.message);
    alert("Failed to store strategy: " + err.message);
  }
  const tradeData = {
    asset: filters.asset,
    strategy_name: filters.strategy,
    setup_grade: selectedGrade, // Add this line
    narrative: strategyNarrative,
    image_url: imageUrl,
    pnl: lastTradePnl,
    timestamp: new Date()
  };
};


const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    const rows = text.split('\n').slice(1); 
    const parsedData = rows
      .filter(row => row.trim() !== "") // Skip empty lines
      .map((row, index) => {
        const cols = row.split(',');
        return { 
          name: cols[0] || `Trade ${index + 1}`, 
          val: parseFloat(cols[1]) || 0 
        };
      });

    if (parsedData.length > 0) {
      setChartData(parsedData); // This triggers the UI update
    }
  };
  reader.readAsText(file);
}
const stats = useMemo(() => {
  if (chartData.length === 0) return { winRate: 0, profitFactor: 0, optimizationScore: 0 };

  const wins = chartData.filter(t => t.val > 0);
  const losses = chartData.filter(t => t.val < 0);
  
  // Advanced Optimization: Check for RR violations
  // (Assuming your CSV/API eventually includes Risk vs Reward data)
  const rrViolations = chartData.filter(t => t.riskReward < strategyRules.minRR).length;
  const optimizationScore = Math.max(0, 100 - (rrViolations * 10));

  return {
    winRate: ((wins.length / chartData.length) * 100).toFixed(1),
    profitFactor: (wins.reduce((s, t) => s + t.val, 0) / Math.abs(losses.reduce((s, t) => s + t.val, 0) || 1)).toFixed(2),
    optimizationScore,
    totalTrades: chartData.length
  };
}, [chartData, strategyRules]);
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
    <>
      <style jsx global>{`
        html, body {
          overflow-x: hidden;
          position: relative;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        :root {
          --brand-primary: ${appearance.primaryColor};
          --brand-glow: ${appearance.primaryColor}66; /* Added this line */
        }
        .text-brand { color: var(--brand-primary); }
        .bg-brand { background-color: var(--brand-primary); }
        .border-brand { border-color: var(--brand-primary); }
        ..shadow-brand { box-shadow: 0 0 20px var(--brand-glow); }
      `}</style>
    <div className="min-h-screen w-full bg-[#020408] text-white font-sans selection:bg-brand/30 overflow-x-hidden relative">
    {/* Neural Background Engine */}
    <div 
      className="fixed inset-0 pointer-events-none opacity-20 transition-opacity duration-1000"
      style={{ 
        background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${theme.primary}25, transparent 80%)` 
      }}
    />
    <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

    {/* This is the inner flex wrapper that holds the sidebar and main content */}
    <div className="relative z-10 flex min-h-screen w-full">
        
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
            <div className="min-w-[48px] h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-brand">
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
                    activeTab === item.id ? 'bg-brand/10 text-brand border-l-2 border-brand' : 'text-white/40 hover:text-white'
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
        activeTab === item.id ? 'bg-purple-500/20 text-brand' : 'text-white/40'
      }`}
    >
      {item.icon}
    </button>
  ))}
</nav>

{/* MAIN CONTENT AREA */}
<main className="flex-1 min-h-screen transition-all duration-500 pl-0 md:pl-24 lg:pl-24">
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
          <div className="flex-1 p-4 md:p-10">
            
              
              {activeTab === 'DASHBOARD' && (
                <>
                  {/* KPI GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
  <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[32px] p-4 md:p-8 h-[350px] md:h-[450px] relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
    <TrendingUp size={20} />
  </div>
  <div>
    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Equity Growth Neural Projection</h3>
    
    {/* STATUS INDICATOR ADDED HERE */}
    <div className="flex items-center gap-2 mt-1">
      <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
      <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">
        {isSyncing ? 'Syncing MT5...' : 'Live Bridge Active'}
      </span>
    </div>
  </div>
</div>

<div className="flex gap-2">
  {['1D', '1W', '1M', 'ALL'].map(tf => (
    <button key={tf} className="px-4 py-2 rounded-lg bg-white/5 text-[9px] font-black hover:bg-white/10 transition-all">{tf}</button>
  ))}
</div>
                        
                      </div>
                      <div className={`w-full h-[300px] md:h-full pb-16 ${isPrivacyMode ? 'blur-2xl' : ''}`}>
                      <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
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
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>

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
                    <div className="col-span-1 lg:col-span-3 bg-white/5 border border-white/5 rounded-[32px] p-4 md:p-8">
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
      <button 
  onClick={syncLiveMT5} // Now triggers the live API fetch
  className="px-6 py-3 bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
>
  <Database size={14} /> {isSyncing ? 'Linking...' : 'Sync MT5'}
</button>
      </div>
    </div>

    {/* SUB-VISUALIZATION: MINI KPI CARDS */}
{/* Update this block in your SYLLEDGE tab */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { label: 'Win Probability', val: `${stats.winRate}%`, sub: `+${stats.totalTrades} SAMPLES` },
    { label: 'Profit Factor', val: stats.profitFactor, sub: 'LIVE DATA' },
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
                       {/* INSERT THE NEW SECTION HERE */}
<div className="mt-10 pt-10 border-t border-white/5 space-y-8">
  <div>
    <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-4 block">
      Strategy Narrative
    </label>
    <textarea 
  value={strategyNarrative}
  onChange={(e) => setStrategyNarrative(e.target.value)}
  placeholder="Explain your setup logic..."
  className="..." 
/>
  </div>

  <div>
    <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-4 block">
      Neural Setup Evidence (Images)
    </label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="aspect-video rounded-[24px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group overflow-hidden relative">
        {entryImage ? (
           <img src={URL.createObjectURL(entryImage)} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <>
            <Upload className="text-white/20 group-hover:text-purple-500 mb-3" size={28} />
            <span className="text-[10px] font-black uppercase text-white/20 group-hover:text-white tracking-widest">Upload Entry Chart</span>
          </>
        )}
        <input type="file" className="hidden" onChange={(e) => setEntryImage(e.target.files[0])} />
      </label>
      
      <div className="aspect-video rounded-[24px] bg-white/5 border border-white/10 flex flex-col items-center justify-center border-dashed">
        <ImageIcon className="text-white/5 mb-2" size={32} />
        <p className="text-[9px] font-black text-white/10 uppercase">Exit Analysis Preview</p>
      </div>
    </div>
  </div>
</div>
                    </div>
                  </div>
                </div>
              )}

{activeTab === 'PLAYBOOK' && (
  <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
    <div className="flex justify-between items-center">
      <h2 className="text-4xl font-black italic tracking-tighter">NEURAL PLAYBOOK</h2>
      <button 
        onClick={() => setIsCreatingStrategy(true)}
        className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all"
      >
        + Create New Strategy
      </button>
    </div>

    {/* Strategy Creator Form */}
    {isCreatingStrategy && (
      <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
        <input 
          placeholder="Strategy Name (e.g. ICT Silver Bullet)"
          className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-bold outline-none focus:border-purple-500"
          onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
        />
        <div className="mb-6">
  <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-4 block">Setup Quality Grade</label>
  <div className="flex gap-2">
    {['A+', 'A', 'B+', 'B'].map((grade) => (
      <button 
        key={grade}
        onClick={() => setSelectedGrade(grade)}
        className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border ${
          selectedGrade === grade 
          ? 'bg-purple-500 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
        }`}
      >
        {grade}
      </button>
    ))}
  </div>
</div>
        <button onClick={handleSaveStrategy} className="w-full py-4 bg-purple-500 rounded-xl font-black uppercase text-[10px] tracking-widest">
          Sync to Neural Network
        </button>
      </div>
    )}

    {/* Display Custom + Default Strategies */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...customPlaybook, { name: 'Default Scalp', rules: 'Standard 1:2 RR', timeframe: '5M' }].map((strat, i) => (
        <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/[0.07] transition-all group">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-black italic">{strat.name}</h3>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[8px] font-black rounded-full">{strat.timeframe}</span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed">{strat.rules}</p>
        </div>
      ))}
    </div>
  </div>
)}

{activeTab === 'SETTINGS' && (
  <div className="flex h-full animate-in fade-in duration-700">
    {/* INTERNAL SETTINGS SIDEBAR */}
    <div className="w-64 border-r border-white/5 p-6 space-y-2">
      <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.3em] mb-8 px-4">System Config</h2>
      {[
        { id: 'ACCOUNT', icon: User, label: 'Account Profile' },
        { id: 'SECURITY', icon: ShieldCheck, label: 'Security & 2FA' },
        { id: 'APPEARANCE', icon: Palette, label: 'Appearance' },
        { id: 'PREFERENCES', icon: Languages, label: 'Preferences' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSettingsSubTab(item.id)}
          className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
            activeSettingsSubTab === item.id 
            ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' 
            : 'text-white/40 hover:bg-white/5 hover:text-white'
          }`}
        >
          <item.icon size={18} className={activeSettingsSubTab === item.id ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </div>

    {/* SETTINGS CONTENT AREA */}
    <div className="flex-1 p-12 overflow-y-auto custom-scroll">
      <div className="max-w-3xl space-y-10">
        
        {/* RENDER CONTENT BASED ON SUB-TAB */}
        {activeSettingsSubTab === 'ACCOUNT' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Account Profile</h3>
            <div className="grid grid-cols-1 gap-6">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/30 uppercase tracking-widest px-1">Display Name</label>
                 <input type="text" defaultValue="Neural Trader" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/30 uppercase tracking-widest px-1">Email Address</label>
                 <input type="email" defaultValue="elite@sylledge.ai" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all" />
               </div>
            </div>
          </div>
        )}

        {activeSettingsSubTab === 'SECURITY' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Security Engine</h3>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase">Two-Factor Authentication</p>
                <p className="text-[10px] text-white/30">Add an extra layer of protection to your neural link.</p>
              </div>
              <div className="w-14 h-7 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-5 h-5 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        )}

{activeSettingsSubTab === 'APPEARANCE' && (
  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
    <header>
      <h3 className="text-3xl font-black italic tracking-tighter uppercase">Appearance Engine</h3>
      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Visual Interface Customization</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Theme Selection */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Interface Mode</label>
        <div className="grid grid-cols-3 gap-3">
          {['DARK', 'LIGHT', 'CYBER'].map(mode => (
            <button 
              key={mode}
              onClick={() => setAppearance({...appearance, mode: mode.toLowerCase()})}
              className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${
                appearance.mode === mode.toLowerCase() 
                ? 'border-brand bg-brand/10 text-brand' 
                : 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color Panel */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Neural Brand Color</label>
        <div className="flex flex-wrap gap-3">
          {['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map(color => (
            <button 
              key={color}
              onClick={() => setAppearance({...appearance, primaryColor: color})}
              className="w-10 h-10 rounded-full border-2 border-white/10 transition-transform hover:scale-110 active:scale-90"
              style={{ backgroundColor: color, borderColor: appearance.primaryColor === color ? 'white' : 'transparent' }}
            />
          ))}
          {/* Custom Color Picker */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group">
             <Plus size={14} className="absolute inset-0 m-auto pointer-events-none group-hover:rotate-90 transition-transform" />
             <input 
              type="color" 
              value={appearance.primaryColor}
              onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
              className="absolute inset-0 w-full h-full scale-150 cursor-pointer opacity-0" 
             />
          </div>
        </div>
      </div>
    </div>

    {/* Live Preview Card */}
    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-[50px] rounded-full -mr-16 -mt-16" />
      <h4 className="text-xs font-black uppercase tracking-widest mb-4">Neural Preview</h4>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/40">
          <Zap size={20} className="text-black" />
        </div>
        <div>
          <p className="text-sm font-bold">Sylledge Interface v3.0</p>
          <p className="text-[10px] text-brand font-black uppercase tracking-widest">Active Neural Link</p>
        </div>
      </div>
    </div>
  </div>
)}

        {activeSettingsSubTab === 'PREFERENCES' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Preferences</h3>
            <div className="space-y-4">
               <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none appearance-none">
                 <option>Language: English (US)</option>
                 <option>Language: Français</option>
               </select>
            </div>
          </div>
        )}

        {/* PERSISTENT SAVE BUTTON */}
<div className="pt-10">
  <button 
    onClick={handleSyncSettings}
    disabled={isSyncing}
    className={`px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isSyncing ? 'Syncing to Cloud...' : 'Sync Changes to Cloud'}
  </button>
</div>
      </div>
    </div>
  </div>
)}
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

  {/* --- NEW: SETUP GRADING SELECTOR --- */}
  <div className="space-y-3">
    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Neural Setup Grade</label>
    <div className="flex gap-2">
      {['A+', 'A', 'B+', 'B'].map((grade) => (
        <button 
          key={grade}
          onClick={() => setSelectedGrade(grade)}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black transition-all border ${
            selectedGrade === grade 
            ? 'bg-purple-500 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
          }`}
        >
          {grade}
        </button>
      ))}
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

  {/* --- UPDATED: CONNECTED NARRATIVE --- */}
  <div className="space-y-3">
    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Strategy Narrative</label>
    <textarea 
      rows={4} 
      value={strategyNarrative}
      onChange={(e) => setStrategyNarrative(e.target.value)}
      placeholder="Describe the neural confluence (Why is this an A+?)..." 
      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-500 transition-all resize-none" 
    />
  </div>
</div>

                  {/* RIGHT COLUMN: VISION & PSYCHOLOGY */}
                  <div className="space-y-8">
                  <div className="space-y-4">
    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block">Market Vision (Image or URL)</label>
                    {/* MT5 SYNC SECTION */}
<div className="col-span-full mt-4 p-6 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:border-purple-500/50 transition-all text-center">
  <input 
    type="file" 
    accept=".csv" 
    onChange={handleFileUpload} 
    className="hidden" 
    id="mt5-upload" 
  />
  <label htmlFor="mt5-upload" className="cursor-pointer">
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
        <Upload size={20} />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest">Sync MT5 History</p>
      <p className="text-[10px] text-white/40">Drop your exported .csv report here</p>
    </div>
  </label>
</div>
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
            if (file) {
              setEntryImage(file); // Stores the actual file for Supabase
            }
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
              <button 
  onClick={handleCommitTrade}
  className="flex-1 py-5 bg-white text-black rounded-[20px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
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

    </div> {/* Closes the div from line 165 */}
  </main> {/* Closes the main from line 164 */}
</div> {/* Closes the div from line 59 */}
</div> {/* Closes the div from line 49 */}
</>
  );
};

export default TradingTerminal;