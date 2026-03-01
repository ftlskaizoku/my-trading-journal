"use client";
// TRADESYLLA — Clean Rebuild
// All hooks declared at top level, before any early returns or conditionals
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  Plus, X, Zap, Cpu, Settings, Palette, Brain, Terminal,
  ShieldCheck, TrendingUp, Calendar, LayoutDashboard, Globe,
  Lock, Activity, Target, User, Languages, ChevronRight,
  Database, Upload, Image as ImageIcon, Send, Sparkles,
  Eye, EyeOff, Key, Smartphone, Bell, BookOpen, Award,
  RefreshCw, CheckCircle, AlertTriangle
} from 'lucide-react';

// ── THEME DEFINITIONS ────────────────────────────────────────────────────────
const THEMES = {
  dark:  { bg:'#020408', surface:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.07)', text:'#ffffff', textMuted:'rgba(255,255,255,0.45)', textDim:'rgba(255,255,255,0.2)', input:'rgba(255,255,255,0.05)' },
  light: { bg:'#f0f4f8', surface:'#ffffff',               border:'rgba(0,0,0,0.08)',       text:'#0f172a', textMuted:'rgba(15,23,42,0.55)',  textDim:'rgba(15,23,42,0.3)',  input:'rgba(0,0,0,0.04)' },
  cyber: { bg:'#000a14', surface:'rgba(0,220,180,0.04)',  border:'rgba(0,220,180,0.12)',   text:'#d8fff8', textMuted:'rgba(0,220,180,0.6)',  textDim:'rgba(0,220,180,0.25)',input:'rgba(0,220,180,0.05)' },
};

// ── HELPER COMPONENTS (defined outside main component — never cause hook issues) ─
const GaugeChart = ({ value = 0, max = 100, color = '#10b981', size = 80 }) => {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const r = size / 2 - 8;
  const cx = size / 2, cy = size / 2 + 4;
  const x1 = cx + r * Math.cos(Math.PI), y1 = cy + r * Math.sin(Math.PI);
  const endAngle = Math.PI + pct * Math.PI;
  const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
  return (
    <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} strokeLinecap="round"/>
      {pct > 0 && <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"/>}
    </svg>
  );
};

const WinLossBar = ({ avgWin = 0, avgLoss = 0 }) => {
  const total = Math.abs(avgWin) + Math.abs(avgLoss) || 1;
  const wp = (Math.abs(avgWin) / total) * 100;
  return (
    <div className="w-full h-2 rounded-full overflow-hidden flex mt-1">
      <div style={{ width: `${wp}%`, backgroundColor: '#10b981' }} className="h-full" />
      <div style={{ width: `${100 - wp}%`, backgroundColor: '#ef4444' }} className="h-full" />
    </div>
  );
};

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    style={{ backgroundColor: value ? 'var(--brand)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }}
    className="w-14 h-7 rounded-full relative flex-shrink-0">
    <div style={{ left: value ? '28px' : '4px', transition: 'left 0.3s', backgroundColor: value ? 'white' : 'rgba(255,255,255,0.4)' }}
      className="absolute top-1 w-5 h-5 rounded-full" />
  </button>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TradingTerminal = () => {

  // ══ ALL STATE — declared unconditionally at top ══════════════════════════════
  const [hasMounted,           setHasMounted]           = useState(false);
  const [activeTab,            setActiveTab]            = useState('DASHBOARD');
  const [isPrivacyMode,        setIsPrivacyMode]        = useState(false);
  const [isSidebarExpanded,    setIsSidebarExpanded]    = useState(false);
  const [isLogModalOpen,       setIsLogModalOpen]       = useState(false);
  const [currentDate,          setCurrentDate]          = useState(new Date());
  const [isSyncing,            setIsSyncing]            = useState(false);
  const [mousePos,             setMousePos]             = useState({ x: 50, y: 50 });
  const [appearance,           setAppearance]           = useState({ mode: 'dark', primaryColor: '#a855f7' });
  const [chartData,            setChartData]            = useState([
    { name: 'Jan 2', val: 420 }, { name: 'Jan 5', val: -150 }, { name: 'Jan 9', val: 630 },
    { name: 'Jan 12', val: 280 }, { name: 'Jan 16', val: -320 }, { name: 'Jan 19', val: 890 },
    { name: 'Jan 23', val: 450 }, { name: 'Jan 26', val: -80 }, { name: 'Jan 30', val: 1100 },
  ]);
  const [tradeHistory,         setTradeHistory]         = useState([]);
  const [filters,              setFilters]              = useState({ asset: 'ALL', strategy: 'ALL', direction: 'ALL' });
  const [tradeForm,            setTradeForm]            = useState({ date: '', strategy: '', grade: 'A', asset: 'XAUUSD', direction: 'LONG', entry: '', exit: '', sl: '', tp: '', rr: '', pnl: '', narrative: '', mindsetTags: [], psychNarrative: '', chartUrl: '' });
  const [entryImage,           setEntryImage]           = useState(null);
  const [entryImagePreview,    setEntryImagePreview]    = useState(null);
  const [playbook,             setPlaybook]             = useState([{ id: 1, name: 'ICT Silver Bullet', timeframe: '15M', description: 'London/NY session displacement into FVG with liquidity sweep confirmation.', confluences: ['FVG Present', 'Liquidity Swept', 'Market Structure Shift', 'Session Time Valid', 'HTF PD Array'], grading: { 'A+': ['FVG Present', 'Liquidity Swept', 'Market Structure Shift', 'Session Time Valid', 'HTF PD Array'], A: ['FVG Present', 'Liquidity Swept', 'Market Structure Shift'], 'B+': ['FVG Present', 'Liquidity Swept'], B: ['FVG Present'] }, active: true }]);
  const [selectedPlaybookId,   setSelectedPlaybookId]   = useState(null);
  const [isCreatingStrategy,   setIsCreatingStrategy]   = useState(false);
  const [newStrategy,          setNewStrategy]          = useState({ name: '', timeframe: '15M', description: '', confluences: [], newConfluence: '' });
  const [sylledgeMessages,     setSylledgeMessages]     = useState([{ role: 'assistant', content: 'Neural link established. I am SYLLEDGE — your AI trading analyst. Share your strategy profile and trade data, and I will provide actionable analysis to improve your results.' }]);
  const [sylledgeInput,        setSylledgeInput]        = useState('');
  const [isAILoading,          setIsAILoading]          = useState(false);
  const [strategyProfile,      setStrategyProfile]      = useState({ description: '', confluences: '', riskRules: '' });
  const [backtestMessages,     setBacktestMessages]     = useState([{ role: 'assistant', content: 'BACKTEST ENGINE online. Describe your strategy, upload reference setups, set your historical range — I will generate a full performance report.' }]);
  const [backtestInput,        setBacktestInput]        = useState('');
  const [backtestForm,         setBacktestForm]         = useState({ strategyDesc: '', confluences: '', timeRange: '6M', asset: 'XAUUSD', riskPer: '1', targetRR: '2' });
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState('ACCOUNT');
  const [profile,              setProfile]              = useState({ name: 'Neural Trader', email: 'elite@tradesylla.ai', bio: '', phone: '', country: '', timezone: 'UTC', currency: 'USD', accountType: 'Live', broker: '' });
  const [security,             setSecurity]             = useState({ twoFactor: false, loginAlerts: true, sessionTimeout: '30', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications,        setNotifications]        = useState({ tradeAlerts: true, aiInsights: true, weeklyReport: true, emailDigest: false });

  // ══ ALL REFS ══════════════════════════════════════════════════════════════════
  const sylledgeChatRef  = useRef(null);
  const backtestChatRef  = useRef(null);

  // ══ ALL MEMOS — declared unconditionally ════════════════════════════════════
  const tk = useMemo(() => THEMES[appearance.mode] || THEMES.dark, [appearance.mode]);
  const brand = appearance.primaryColor;

  const stats = useMemo(() => {
    if (!chartData.length) return { winRate: '0.0', profitFactor: '0', totalTrades: 0, netPnL: '0.00', avgWin: '0.00', avgLoss: '0.00', expectancy: '0.00', maxDrawdown: '0.00', bestDay: '0.00', worstDay: '0.00', currentStreak: 0 };
    const wins   = chartData.filter(t => t.val > 0);
    const losses = chartData.filter(t => t.val < 0);
    const winSum  = wins.reduce((s, t) => s + t.val, 0);
    const lossSum = Math.abs(losses.reduce((s, t) => s + t.val, 0));
    const avgWin  = wins.length   ? winSum  / wins.length   : 0;
    const avgLoss = losses.length ? lossSum / losses.length : 0;
    const expectancy = (wins.length / chartData.length) * avgWin - (losses.length / chartData.length) * avgLoss;
    let peak = 0, running = 0, maxDD = 0;
    chartData.forEach(t => { running += t.val; if (running > peak) peak = running; const dd = peak - running; if (dd > maxDD) maxDD = dd; });
    let streak = 0;
    for (let i = chartData.length - 1; i >= 0; i--) {
      const w = chartData[i].val > 0;
      if (i === chartData.length - 1) { streak = w ? 1 : -1; }
      else if ((streak > 0 && w) || (streak < 0 && !w)) { streak = w ? streak + 1 : streak - 1; }
      else break;
    }
    return {
      winRate:       ((wins.length / chartData.length) * 100).toFixed(1),
      profitFactor:  lossSum > 0 ? (winSum / lossSum).toFixed(2) : winSum > 0 ? '∞' : '0',
      totalTrades:   chartData.length,
      netPnL:        chartData.reduce((s, t) => s + t.val, 0).toFixed(2),
      avgWin:        avgWin.toFixed(2),
      avgLoss:       avgLoss.toFixed(2),
      expectancy:    expectancy.toFixed(2),
      maxDrawdown:   maxDD.toFixed(2),
      bestDay:       Math.max(...chartData.map(t => t.val)).toFixed(2),
      worstDay:      Math.min(...chartData.map(t => t.val)).toFixed(2),
      currentStreak: streak,
    };
  }, [chartData]);

  const cumulativePnL = useMemo(() => {
    let r = 0;
    return chartData.map(t => ({ name: t.name, cumulative: parseFloat((r += t.val).toFixed(2)), daily: t.val }));
  }, [chartData]);

  const radarData = useMemo(() => {
    const wr = parseFloat(stats.winRate) / 100;
    const pf = Math.min(parseFloat(stats.profitFactor) || 0, 3);
    return [
      { subject: 'Win Rate',      A: wr * 150,                                                          fullMark: 150 },
      { subject: 'Profit Factor', A: (pf / 3) * 150,                                                    fullMark: 150 },
      { subject: 'Expectancy',    A: Math.min(Math.max(parseFloat(stats.expectancy) / 500, 0), 1) * 150, fullMark: 150 },
      { subject: 'Consistency',   A: 105,                                                                fullMark: 150 },
      { subject: 'Risk Mgmt',     A: 90,                                                                 fullMark: 150 },
    ];
  }, [stats]);

  // MUST be before early return — no exceptions
  const weeklyStats = useMemo(() => ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label, i) => ({
    label,
    pnl:  [420 + i * 200, -150 + i * 300, 680 + i * 100, 320 - i * 50][i],
    days: [2, 3, 4, 2][i],
  })), []);

  // ══ ALL EFFECTS ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const a = localStorage.getItem('tradesylla_appearance');
    if (a) { try { setAppearance(JSON.parse(a)); } catch (_) {} }
    const p = localStorage.getItem('tradesylla_profile');
    if (p) { try { setProfile(JSON.parse(p)); } catch (_) {} }
    const pb = localStorage.getItem('tradesylla_playbook');
    if (pb) { try { setPlaybook(JSON.parse(pb)); } catch (_) {} }
    setHasMounted(true);
    const mm = (e) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', mm);
    return () => window.removeEventListener('mousemove', mm);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand', brand);
    document.documentElement.style.setProperty('--brand-glow', brand + '44');
  }, [brand]);

  useEffect(() => { if (sylledgeChatRef.current)  sylledgeChatRef.current.scrollTop  = sylledgeChatRef.current.scrollHeight;  }, [sylledgeMessages]);
  useEffect(() => { if (backtestChatRef.current)  backtestChatRef.current.scrollTop  = backtestChatRef.current.scrollHeight;  }, [backtestMessages]);

  // ── EARLY RETURN (all hooks are above this line) ──────────────────────────────
  if (!hasMounted) return null;

  // ══ HANDLERS ══════════════════════════════════════════════════════════════════
  const syncLiveMT5 = async () => {
    setIsSyncing(true);
    try {
      const TOKEN   = process.env.NEXT_PUBLIC_METAAPI_TOKEN;
      const ACCOUNT = process.env.NEXT_PUBLIC_METAAPI_ACCOUNT_ID;
      if (!TOKEN || !ACCOUNT) { alert('Add MetaAPI credentials to .env.local'); return; }
      const res = await fetch(`https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${ACCOUNT}/history-orders/filled?from=2025-01-01T00:00:00.000Z&to=2026-12-31T23:59:59.999Z`, { headers: { 'auth-token': TOKEN } });
      if (res.status === 404) { alert('Account not DEPLOYED in MetaApi.'); return; }
      if (!res.ok) throw new Error('Sync failed');
      const data  = await res.json();
      const live  = data.map(t => ({ name: new Date(t.doneTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), val: t.profit }));
      if (live.length) setChartData(live);
    } catch (e) { alert('Sync error: ' + e.message); }
    finally     { setIsSyncing(false); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = ev.target.result.split('\n').slice(1).filter(r => r.trim()).map((r, i) => {
        const cols = r.split(',');
        return { name: cols[0]?.trim() || `Trade ${i + 1}`, val: parseFloat(cols[1]) || 0 };
      });
      if (parsed.length) setChartData(parsed);
    };
    reader.readAsText(file);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEntryImage(file);
    setEntryImagePreview(URL.createObjectURL(file));
  };

  const handleCommitTrade = async () => {
    try {
      let imageUrl = null;
      if (entryImage) {
        const ext = entryImage.name.split('.').pop();
        const path = `setups/${Math.random()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('trading-images').upload(path, entryImage);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from('trading-images').getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
      const record = { asset: tradeForm.asset, strategy_name: tradeForm.strategy, setup_grade: tradeForm.grade, narrative: tradeForm.narrative, image_url: imageUrl, pnl: parseFloat(tradeForm.pnl) || 0, direction: tradeForm.direction, timestamp: new Date() };
      await supabase.from('trades').insert([record]);
      const entry = { ...tradeForm, image_url: imageUrl, id: Date.now(), timestamp: new Date().toISOString() };
      setTradeHistory(p => [entry, ...p]);
      if (tradeForm.pnl) setChartData(p => [...p, { name: tradeForm.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), val: parseFloat(tradeForm.pnl) }]);
      setIsLogModalOpen(false);
      setTradeForm({ date: '', strategy: '', grade: 'A', asset: 'XAUUSD', direction: 'LONG', entry: '', exit: '', sl: '', tp: '', rr: '', pnl: '', narrative: '', mindsetTags: [], psychNarrative: '', chartUrl: '' });
      setEntryImage(null); setEntryImagePreview(null);
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('tradesylla_appearance', JSON.stringify(appearance));
    localStorage.setItem('tradesylla_profile',    JSON.stringify(profile));
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  const sendToAI = async (tab) => {
    const input = tab === 'SYLLEDGE' ? sylledgeInput : backtestInput;
    if (!input.trim() || isAILoading) return;
    const msgs    = tab === 'SYLLEDGE' ? sylledgeMessages  : backtestMessages;
    const setMsgs = tab === 'SYLLEDGE' ? setSylledgeMessages : setBacktestMessages;
    const setInput = tab === 'SYLLEDGE' ? setSylledgeInput  : setBacktestInput;
    const system = tab === 'SYLLEDGE'
      ? `You are SYLLEDGE, an elite AI trading analyst. Trader stats: Win Rate ${stats.winRate}%, Profit Factor ${stats.profitFactor}, Net P&L $${stats.netPnL}, Expectancy $${stats.expectancy}/trade, ${stats.totalTrades} total trades. Strategy: "${strategyProfile.description}". Confluences: "${strategyProfile.confluences}". Risk rules: "${strategyProfile.riskRules}". Playbook: ${playbook.map(s => s.name).join(', ')}. Give precise, data-driven trading feedback.`
      : `You are a professional trading backtest AI. Strategy: "${backtestForm.strategyDesc}". Confluences: "${backtestForm.confluences}". Asset: ${backtestForm.asset}, range: ${backtestForm.timeRange}, risk: ${backtestForm.riskPer}%, target R:R: ${backtestForm.targetRR}. Provide: max losing/winning streak, optimal SL placement, best entry times, best days, performance projections.`;
    const updated = [...msgs, { role: 'user', content: input }];
    setMsgs(updated); setInput(''); setIsAILoading(true);
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: updated, system }) });
      const data = await res.json();
      setMsgs(p => [...p, { role: 'assistant', content: data.content || data.error || 'No response' }]);
    } catch (e) { setMsgs(p => [...p, { role: 'assistant', content: 'API error: ' + e.message }]); }
    finally { setIsAILoading(false); }
  };

  // ══ CALENDAR RENDERER ══════════════════════════════════════════════════════════
  const renderCalendar = () => {
    const y = currentDate.getFullYear(), m = currentDate.getMonth();
    const days  = new Date(y, m + 1, 0).getDate();
    const first = new Date(y, m, 1).getDay();
    const cells = Array.from({ length: first }, (_, i) => <div key={`e${i}`} />);
    for (let d = 1; d <= days; d++) {
      const has  = d % 3 === 0;
      const pnl  = has ? (d % 2 === 0 ? 420 : -150) : 0;
      const cnt  = has ? (d % 5) + 1 : 0;
      cells.push(
        <div key={d} style={{ background: tk.surface, borderColor: tk.border }} className="aspect-square rounded-xl border flex flex-col justify-between p-1.5 md:p-2 group hover:opacity-90 transition-all cursor-pointer relative overflow-hidden">
          <span style={{ color: tk.textMuted }} className="text-[10px] md:text-[11px] font-black">{d}</span>
          {has && (
            <div className="space-y-0.5">
              <div className={`px-1 py-0.5 rounded-md text-center ${pnl >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                <p className={`text-[7px] md:text-[9px] font-black ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{pnl >= 0 ? `+$${pnl}` : `-$${Math.abs(pnl)}`}</p>
              </div>
              <p style={{ color: tk.textDim }} className="text-[6px] md:text-[7px] text-center">{cnt}T</p>
            </div>
          )}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${pnl > 0 ? 'bg-emerald-500' : pnl < 0 ? 'bg-rose-500' : ''}`} />
        </div>
      );
    }
    return cells;
  };

  // ══ RENDER ════════════════════════════════════════════════════════════════════
  return (
    <>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        :root { --brand: ${brand}; --brand-glow: ${brand}44; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        select option { background: #0a0a0a; color: white; }
        .ai-typing::after { content: '▋'; animation: blink 1s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { -webkit-tap-highlight-color: transparent; }
        button { touch-action: manipulation; }
        input, textarea, select { font-size: 16px !important; }

        /* Mobile fixes */
        @media (max-width: 768px) {
          .settings-layout    { flex-direction: column !important; }
          .settings-sidebar   { width: 100% !important; position: static !important; display: flex !important; flex-direction: row !important; overflow-x: auto !important; gap: 4px !important; padding: 8px !important; }
          .settings-sidebar button { flex-shrink: 0 !important; white-space: nowrap !important; }
          .settings-content   { padding: 16px !important; }
          .ai-panel-layout    { display: flex !important; flex-direction: column !important; height: auto !important; }
          .ai-config-panel    { max-height: 50vh; overflow-y: auto; }
          .ai-chat-panel      { height: 55vh !important; min-height: 320px; }
          .table-wrapper      { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
          .table-wrapper table { min-width: 560px; }
          .fab-btn            { bottom: 74px !important; right: 14px !important; width: 52px !important; height: 52px !important; }
          .modal-wrap         { padding: 0 !important; align-items: flex-end !important; }
          .modal-inner        { border-radius: 24px 24px 0 0 !important; max-width: 100% !important; width: 100% !important; }
          .modal-grid         { grid-template-columns: 1fr !important; }
          header              { height: auto !important; min-height: 56px !important; padding: 10px 14px !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid   { grid-template-columns: 1fr 1fr !important; }
          .chart-wrap { height: 200px !important; }
        }
      `}</style>

      <div style={{ backgroundColor: tk.bg, color: tk.text, minHeight: '100vh' }} className="font-sans overflow-x-hidden relative w-full transition-colors duration-300">

        {/* Neural ambient bg */}
        <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${brand}15, transparent 80%)`, zIndex: 0 }} />

        <div className="relative flex min-h-screen w-full" style={{ zIndex: 1 }}>

          {/* ── SIDEBAR (desktop) ─────────────────────────────────────────────── */}
          <aside onMouseEnter={() => setIsSidebarExpanded(true)} onMouseLeave={() => setIsSidebarExpanded(false)}
            style={{ backgroundColor: tk.bg, borderColor: tk.border }}
            className={`hidden md:flex flex-col border-r transition-all duration-500 z-50 fixed left-0 h-full ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
            <div className="flex flex-col h-full py-8 px-4">
              <div className="flex items-center gap-3 mb-12 overflow-hidden px-2">
                <div className="min-w-[40px] h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: brand }}>
                  <Zap size={20} className="text-white fill-white" />
                </div>
                <div className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  <h1 className="text-lg font-black italic tracking-tighter">TRADESYLLA</h1>
                  <p className="text-[7px] font-bold tracking-[0.4em] uppercase" style={{ color: brand }}>Elite Neural</p>
                </div>
              </div>
              <nav className="space-y-1 flex-1">
                {[
                  { id: 'DASHBOARD',    icon: <LayoutDashboard size={18}/>, label: 'Dashboard'  },
                  { id: 'SYLLEDGE',     icon: <Brain size={18}/>,           label: 'Sylledge AI' },
                  { id: 'BACKTEST',     icon: <Cpu size={18}/>,             label: 'AI Backtest' },
                  { id: 'PLAYBOOK',     icon: <BookOpen size={18}/>,        label: 'Playbook'    },
                  { id: 'TRADE_LOG',    icon: <Terminal size={18}/>,        label: 'Trade Log'   },
                  { id: 'SETTINGS',     icon: <Settings size={18}/>,        label: 'Settings'    },
                ].map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    style={{ color: activeTab === item.id ? brand : tk.textMuted, backgroundColor: activeTab === item.id ? `${brand}15` : 'transparent', borderLeft: activeTab === item.id ? `2px solid ${brand}` : '2px solid transparent' }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl transition-all">
                    <div className="min-w-[18px]">{item.icon}</div>
                    <span className={`text-[9px] font-black tracking-widest uppercase whitespace-nowrap transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
          <nav style={{ backgroundColor: tk.bg, borderColor: tk.border }} className="flex md:hidden fixed bottom-0 left-0 w-full border-t z-[100] px-2 py-2 justify-around items-center">
            {[
              { id: 'DASHBOARD', icon: <LayoutDashboard size={20}/> },
              { id: 'SYLLEDGE',  icon: <Brain size={20}/> },
              { id: 'BACKTEST',  icon: <Cpu size={20}/> },
              { id: 'PLAYBOOK',  icon: <BookOpen size={20}/> },
              { id: 'SETTINGS',  icon: <Settings size={20}/> },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                style={{ color: activeTab === item.id ? brand : tk.textMuted, backgroundColor: activeTab === item.id ? `${brand}15` : 'transparent' }}
                className="p-3 rounded-xl transition-all">{item.icon}</button>
            ))}
          </nav>

          {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
          <main className="flex-1 min-h-screen pl-0 md:pl-20 transition-all duration-500">
            <div className="p-4 md:p-8 pb-28 md:pb-10 max-w-[1600px] mx-auto space-y-6">

              {/* Header — no New Position button here */}
              <header style={{ borderColor: tk.border, backgroundColor: tk.bg + 'dd' }}
                className="border-b flex items-center justify-between px-4 md:px-6 py-3 backdrop-blur-md sticky top-0 z-20 gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p style={{ color: tk.textDim }} className="text-[8px] font-black uppercase tracking-widest hidden sm:block">Neural Node Linked</p>
                    </div>
                    <h2 style={{ color: tk.text }} className="text-xs font-black uppercase tracking-widest italic">{activeTab.replace('_', ' ')}</h2>
                  </div>
                  <button onClick={() => setIsPrivacyMode(p => !p)}
                    style={{ borderColor: isPrivacyMode ? brand : tk.border, color: isPrivacyMode ? brand : tk.textMuted }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[8px] font-black uppercase">
                    {isPrivacyMode ? <EyeOff size={12}/> : <Eye size={12}/>} Ghost
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div style={{ background: tk.surface, borderColor: tk.border }} className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl border">
                    <p style={{ color: tk.textDim }} className="text-[7px] uppercase font-bold">Latency</p>
                    <p style={{ color: brand }} className="text-[10px] font-black">14ms</p>
                    <Activity size={12} style={{ color: brand }}/>
                  </div>
                  <button onClick={() => setActiveTab('SETTINGS')} style={{ borderColor: tk.border }} className="w-9 h-9 rounded-xl border flex items-center justify-center hover:border-brand transition-all">
                    <User size={15} style={{ color: tk.textMuted }}/>
                  </button>
                </div>
              </header>

              {/* ╔══════════════════════════════════════════════════╗
                  ║  DASHBOARD                                       ║
                  ╚══════════════════════════════════════════════════╝ */}
              {activeTab === 'DASHBOARD' && (
                <div className="space-y-6">

                  {/* KPI cards */}
                  <div className="kpi-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                    {[
                      { label: 'Net P&L',      val: `$${parseFloat(stats.netPnL).toLocaleString()}`,   color: parseFloat(stats.netPnL) >= 0 ? '#10b981' : '#ef4444', sub: `${stats.totalTrades} trades` },
                      { label: 'Trade Win %',  val: `${stats.winRate}%`,   gauge: { v: parseFloat(stats.winRate),                                        c: '#10b981' }, sub: null },
                      { label: 'Profit Factor',val: stats.profitFactor,     gauge: { v: Math.min(parseFloat(stats.profitFactor)||0, 3)/3*100,            c: parseFloat(stats.profitFactor) >= 1.5 ? '#10b981' : '#f59e0b' }, sub: null },
                      { label: 'Day Win %',    val: `${stats.winRate}%`,   gauge: { v: parseFloat(stats.winRate),                                        c: '#3b82f6' }, sub: null },
                      { label: 'Avg Win/Loss', val: `$${stats.avgWin}`,   winLoss: true },
                    ].map((c, i) => (
                      <div key={i} style={{ background: tk.surface, borderColor: tk.border }} className="p-4 md:p-5 rounded-2xl border hover:border-brand/30 transition-all">
                        <p style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest mb-2">{c.label}</p>
                        <div className="flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <p style={{ color: c.color || tk.text, filter: isPrivacyMode ? 'blur(8px)' : 'none' }} className="text-xl md:text-2xl font-black italic tracking-tighter truncate">{c.val}</p>
                            {c.sub && <p style={{ color: tk.textDim }} className="text-[7px] font-bold uppercase mt-1">{c.sub}</p>}
                          </div>
                          {c.gauge && <GaugeChart value={c.gauge.v} color={c.gauge.c} size={64}/>}
                        </div>
                        {c.winLoss && (
                          <div className="mt-2">
                            <div className="flex justify-between">
                              <span className="text-[7px] text-emerald-400 font-black">+${stats.avgWin}</span>
                              <span className="text-[7px] text-rose-400 font-black">-${stats.avgLoss}</span>
                            </div>
                            <WinLossBar avgWin={parseFloat(stats.avgWin)} avgLoss={parseFloat(stats.avgLoss)}/>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Secondary KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Expectancy',     val: `$${stats.expectancy}`,   color: parseFloat(stats.expectancy) > 0 ? '#10b981' : '#ef4444', icon: <Target size={14}/> },
                      { label: 'Max Drawdown',   val: `$${stats.maxDrawdown}`,  color: '#ef4444', icon: <AlertTriangle size={14}/> },
                      { label: 'Best Day',       val: `+$${stats.bestDay}`,     color: '#10b981', icon: <Award size={14}/> },
                      { label: 'Streak',         val: `${stats.currentStreak > 0 ? '+' : ''}${stats.currentStreak} ${stats.currentStreak > 0 ? '🔥' : '❄️'}`, color: stats.currentStreak > 0 ? '#10b981' : '#ef4444', icon: <Activity size={14}/> },
                    ].map((c, i) => (
                      <div key={i} style={{ background: tk.surface, borderColor: tk.border }} className="p-3 md:p-4 rounded-2xl border flex items-center gap-3">
                        <div style={{ backgroundColor: `${c.color}20`, color: c.color }} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">{c.icon}</div>
                        <div className="min-w-0">
                          <p style={{ color: tk.textDim }} className="text-[7px] font-bold uppercase tracking-widest">{c.label}</p>
                          <p style={{ color: c.color, filter: isPrivacyMode ? 'blur(8px)' : 'none' }} className="text-base md:text-lg font-black truncate">{c.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div style={{ background: tk.surface, borderColor: tk.border }} className="lg:col-span-2 rounded-2xl border p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div>
                          <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">Daily Net Cumulative P&L</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}/>
                            <p style={{ color: tk.textDim }} className="text-[8px] font-bold uppercase">{isSyncing ? 'Syncing...' : 'Live'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={syncLiveMT5} disabled={isSyncing} style={{ borderColor: tk.border, color: tk.textMuted }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[8px] font-black uppercase hover:border-brand transition-all">
                            <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''}/> MT5
                          </button>
                          {['1W','1M','ALL'].map(tf => <button key={tf} style={{ color: tk.textDim, background: tk.input }} className="px-2 py-1 rounded-lg text-[8px] font-black hover:opacity-70 transition-all">{tf}</button>)}
                        </div>
                      </div>
                      <div className="chart-wrap" style={{ height: 260, filter: isPrivacyMode ? 'blur(12px)' : 'none' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={cumulativePnL}>
                            <defs>
                              <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={brand} stopOpacity={0.35}/>
                                <stop offset="95%" stopColor={brand} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tk.textDim, fontSize: 9 }} dy={6}/>
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: tk.textDim, fontSize: 9 }}/>
                            <Tooltip contentStyle={{ backgroundColor: tk.bg, border: `1px solid ${tk.border}`, borderRadius: 12, fontSize: 10, color: tk.text }}/>
                            <Area type="monotone" dataKey="cumulative" stroke={brand} strokeWidth={3} fill="url(#cumGrad)"/>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 md:p-6">
                      <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest mb-4">Net Daily P&L</h3>
                      <div style={{ height: 260, filter: isPrivacyMode ? 'blur(12px)' : 'none' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={cumulativePnL} barSize={10}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tk.textDim, fontSize: 8 }} dy={4}/>
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: tk.textDim, fontSize: 8 }}/>
                            <Tooltip contentStyle={{ backgroundColor: tk.bg, border: `1px solid ${tk.border}`, borderRadius: 12, fontSize: 10, color: tk.text }}/>
                            <Bar dataKey="daily" radius={[3, 3, 0, 0]}>
                              {cumulativePnL.map((e, i) => <Cell key={i} fill={e.daily >= 0 ? '#10b981' : '#ef4444'}/>)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Radar + Calendar + Weekly */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                    <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 md:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">Neural Score</h3>
                        <span style={{ backgroundColor: `${brand}20`, color: brand }} className="px-2 py-0.5 rounded-full text-[7px] font-black">BETA</span>
                      </div>
                      <ResponsiveContainer width="100%" height={170}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke={tk.border}/>
                          <PolarAngleAxis dataKey="subject" tick={{ fill: tk.textDim, fontSize: 7 }}/>
                          <Radar dataKey="A" stroke={brand} fill={brand} fillOpacity={0.4}/>
                        </RadarChart>
                      </ResponsiveContainer>
                      <p style={{ color: tk.textMuted }} className="text-center text-[9px] font-bold mt-2">
                        Score: <span style={{ color: brand }} className="text-base font-black">{Math.round(parseFloat(stats.winRate) * 0.8 + (parseFloat(stats.profitFactor) || 0) * 10)}</span>
                      </p>
                    </div>

                    <div style={{ background: tk.surface, borderColor: tk.border }} className="lg:col-span-2 rounded-2xl border p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">Execution Matrix</h3>
                        <div style={{ background: tk.input, borderColor: tk.border }} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border">
                          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} style={{ color: tk.textMuted }} className="hover:text-brand transition-colors"><ChevronRight size={13} className="rotate-180"/></button>
                          <span style={{ color: tk.text }} className="text-[9px] font-black uppercase tracking-wider min-w-[80px] text-center">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} style={{ color: tk.textMuted }} className="hover:text-brand transition-colors"><ChevronRight size={13}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ color: tk.textDim }} className="text-center text-[7px] font-black uppercase py-1">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                    </div>

                    <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 md:p-6">
                      <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest mb-4">Weekly Summary</h3>
                      <div className="space-y-2">
                        {weeklyStats.map((w, i) => (
                          <div key={i} style={{ borderColor: tk.border }} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p style={{ color: tk.text }} className="text-[10px] font-black">{w.label}</p>
                              <p style={{ color: tk.textDim }} className="text-[8px]">{w.days} days</p>
                            </div>
                            <p style={{ color: w.pnl >= 0 ? '#10b981' : '#ef4444', filter: isPrivacyMode ? 'blur(8px)' : 'none' }} className="text-sm font-black">{w.pnl >= 0 ? '+' : ''}${w.pnl}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: `${brand}10`, borderColor: `${brand}30` }} className="mt-3 p-3 rounded-xl border">
                        <p style={{ color: brand }} className="text-[7px] font-black uppercase tracking-widest">Neural Insight</p>
                        <p style={{ color: tk.textMuted }} className="text-[9px] mt-1 leading-relaxed">Win rate peaks Tue–Thu. Avoid Monday entries.</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent trades */}
                  <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border overflow-hidden">
                    <div style={{ borderColor: tk.border }} className="flex items-center justify-between p-4 md:p-5 border-b">
                      <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">Recent Trades</h3>
                      <button onClick={() => setActiveTab('TRADE_LOG')} style={{ color: brand }} className="text-[8px] font-black uppercase hover:opacity-70 transition-all">View All →</button>
                    </div>
                    <div className="table-wrapper">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: tk.input, borderColor: tk.border }} className="border-b">
                            {['Date','Asset','Dir','Grade','Strategy','P&L'].map(h => (
                              <th key={h} style={{ color: tk.textDim }} className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-widest">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tradeHistory.length === 0
                            ? <tr><td colSpan={6} style={{ color: tk.textDim }} className="px-4 py-10 text-center text-[9px] font-bold uppercase">No trades yet — use the + button below.</td></tr>
                            : tradeHistory.slice(0, 8).map((t, i) => (
                              <tr key={i} style={{ borderColor: tk.border }} className="border-b last:border-0">
                                <td style={{ color: tk.textMuted }} className="px-4 py-3 text-[9px]">{t.date}</td>
                                <td style={{ color: tk.text }} className="px-4 py-3 text-[9px] font-black">{t.asset}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[7px] font-black ${t.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{t.direction}</span></td>
                                <td className="px-4 py-3"><span style={{ backgroundColor: `${brand}20`, color: brand }} className="px-2 py-0.5 rounded-full text-[7px] font-black">{t.grade}</span></td>
                                <td style={{ color: tk.textMuted }} className="px-4 py-3 text-[9px]">{t.strategy}</td>
                                <td style={{ color: parseFloat(t.pnl) >= 0 ? '#10b981' : '#ef4444', filter: isPrivacyMode ? 'blur(8px)' : 'none' }} className="px-4 py-3 text-[9px] font-black">{parseFloat(t.pnl) >= 0 ? '+' : ''}${t.pnl}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════════════════╗
                  ║  SYLLEDGE AI                                     ║
                  ╚══════════════════════════════════════════════════╝ */}
              {activeTab === 'SYLLEDGE' && (
                <div className="ai-panel-layout grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6" style={{ minHeight: 560 }}>
                  {/* Config panel */}
                  <div className="ai-config-panel space-y-4 overflow-y-auto">
                    <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 md:p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ backgroundColor: `${brand}20`, color: brand }} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"><Brain size={16}/></div>
                        <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">Strategy Profile</h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Your Trading Strategy', key: 'description', ph: 'e.g. I trade ICT concepts — Silver Bullet, FVG fills...', rows: 4 },
                          { label: 'Required Confluences',  key: 'confluences',  ph: 'e.g. FVG + Liquidity sweep + MSS...',                  rows: 3 },
                          { label: 'Risk Rules',            key: 'riskRules',   ph: 'e.g. Max 1% risk, min 1:3 RR...',                       rows: 2 },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block mb-1.5">{f.label}</label>
                            <textarea rows={f.rows} value={strategyProfile[f.key]} onChange={e => setStrategyProfile(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph}
                              style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-xs outline-none resize-none focus:border-brand transition-all"/>
                          </div>
                        ))}
                        <button onClick={() => sendToAI('SYLLEDGE')} style={{ backgroundColor: brand }} className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all">
                          Sync & Analyze
                        </button>
                      </div>
                    </div>
                    <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4">
                      <h3 style={{ color: tk.text }} className="text-[9px] font-black uppercase tracking-widest mb-3">Quick Analysis</h3>
                      <div className="space-y-1.5">
                        {['Analyze my worst losing trades', 'Compare A+ vs B trades', 'Best days to trade?', 'How to improve my win rate?'].map((p, i) => (
                          <button key={i} onClick={() => { setSylledgeInput(p); sendToAI('SYLLEDGE'); }}
                            style={{ background: tk.input, borderColor: tk.border, color: tk.textMuted }}
                            className="w-full text-left px-3 py-2 rounded-xl border text-[8px] font-bold hover:border-brand hover:text-brand transition-all">
                            → {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chat panel */}
                  <div style={{ background: tk.surface, borderColor: tk.border }} className="ai-chat-panel lg:col-span-2 rounded-2xl border flex flex-col overflow-hidden">
                    <div style={{ borderColor: tk.border, background: tk.input }} className="p-4 border-b flex items-center gap-3">
                      <div style={{ backgroundColor: brand }} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"><Sparkles size={16} className="text-white"/></div>
                      <div>
                        <p style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">SYLLEDGE AI</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                          <p style={{ color: tk.textDim }} className="text-[7px] font-bold uppercase">Neural Analysis Active</p>
                        </div>
                      </div>
                    </div>
                    <div ref={sylledgeChatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                      {sylledgeMessages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div style={{ backgroundColor: m.role === 'user' ? brand : tk.input, color: m.role === 'user' ? 'white' : tk.text, borderColor: m.role === 'user' ? 'transparent' : tk.border }}
                            className="max-w-[85%] rounded-2xl px-4 py-3 text-[11px] leading-relaxed border whitespace-pre-wrap">{m.content}</div>
                        </div>
                      ))}
                      {isAILoading && activeTab === 'SYLLEDGE' && (
                        <div className="flex justify-start">
                          <div style={{ background: tk.input, borderColor: tk.border, color: tk.textMuted }} className="rounded-2xl px-4 py-3 text-[11px] border ai-typing">Analyzing</div>
                        </div>
                      )}
                    </div>
                    <div style={{ borderColor: tk.border, background: tk.input }} className="p-3 border-t">
                      <div style={{ background: tk.surface, borderColor: tk.border }} className="flex items-center gap-2 rounded-xl border px-3 py-2.5">
                        <input value={sylledgeInput} onChange={e => setSylledgeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendToAI('SYLLEDGE')}
                          placeholder="Ask SYLLEDGE about your performance..."
                          style={{ color: tk.text, background: 'transparent' }} className="flex-1 text-xs outline-none placeholder:opacity-30"/>
                        <button onClick={() => sendToAI('SYLLEDGE')} disabled={isAILoading || !sylledgeInput.trim()}
                          style={{ backgroundColor: brand }} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0">
                          <Send size={12} className="text-white"/>
                        </button>
                      </div>
                      <p style={{ color: tk.textDim }} className="text-[7px] text-center mt-1.5">Requires /api/ai route with ANTHROPIC_API_KEY</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════════════════╗
                  ║  AI BACKTEST                                     ║
                  ╚══════════════════════════════════════════════════╝ */}
              {activeTab === 'BACKTEST' && (
                <div className="ai-panel-layout grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6" style={{ minHeight: 560 }}>
                  <div className="ai-config-panel space-y-4 overflow-y-auto">
                    <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 md:p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ backgroundColor: 'rgba(59,130,246,0.2)', color: '#3b82f6' }} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"><Cpu size={16}/></div>
                        <h3 style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">Backtest Config</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block mb-1.5">Strategy Description</label>
                          <textarea rows={4} value={backtestForm.strategyDesc} onChange={e => setBacktestForm(f => ({ ...f, strategyDesc: e.target.value }))} placeholder="Describe the strategy in detail..."
                            style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-xs outline-none resize-none focus:border-brand transition-all"/>
                        </div>
                        <div>
                          <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block mb-1.5">Confluences</label>
                          <textarea rows={3} value={backtestForm.confluences} onChange={e => setBacktestForm(f => ({ ...f, confluences: e.target.value }))} placeholder="List all entry conditions..."
                            style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-xs outline-none resize-none focus:border-brand transition-all"/>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Asset',      key: 'asset',      opts: ['XAUUSD','NAS100','GER40','UKOIL'] },
                            { label: 'Time Range', key: 'timeRange',  opts: ['3M','6M','1Y','2Y','3Y'] },
                          ].map(f => (
                            <div key={f.key}>
                              <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block mb-1.5">{f.label}</label>
                              <select value={backtestForm[f.key]} onChange={e => setBacktestForm(b => ({ ...b, [f.key]: e.target.value }))}
                                style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-xs outline-none focus:border-brand transition-all">
                                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            </div>
                          ))}
                          {[
                            { label: 'Risk %',   key: 'riskPer'  },
                            { label: 'Target RR', key: 'targetRR' },
                          ].map(f => (
                            <div key={f.key}>
                              <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block mb-1.5">{f.label}</label>
                              <input type="number" step="0.1" value={backtestForm[f.key]} onChange={e => setBacktestForm(b => ({ ...b, [f.key]: e.target.value }))}
                                style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-xs outline-none focus:border-brand transition-all"/>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { setBacktestInput(`Please run a backtest for: ${backtestForm.strategyDesc}. Confluences: ${backtestForm.confluences}. Asset: ${backtestForm.asset}, range: ${backtestForm.timeRange}, risk: ${backtestForm.riskPer}%, target R:R: ${backtestForm.targetRR}.`); sendToAI('BACKTEST'); }}
                          className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all flex items-center justify-center gap-2" style={{ backgroundColor: '#3b82f6' }}>
                          <Cpu size={13}/> Run AI Backtest
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: tk.surface, borderColor: tk.border }} className="ai-chat-panel lg:col-span-2 rounded-2xl border flex flex-col overflow-hidden">
                    <div style={{ borderColor: tk.border, background: tk.input }} className="p-4 border-b flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3b82f6' }}><Cpu size={16} className="text-white"/></div>
                      <div>
                        <p style={{ color: tk.text }} className="text-[10px] font-black uppercase tracking-widest">BACKTEST ENGINE</p>
                        <p style={{ color: tk.textDim }} className="text-[7px] font-bold uppercase">AI-Powered Strategy Analysis</p>
                      </div>
                    </div>
                    <div ref={backtestChatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                      {backtestMessages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div style={{ backgroundColor: m.role === 'user' ? '#3b82f6' : tk.input, color: m.role === 'user' ? 'white' : tk.text, borderColor: m.role === 'user' ? 'transparent' : tk.border }}
                            className="max-w-[85%] rounded-2xl px-4 py-3 text-[11px] leading-relaxed border whitespace-pre-wrap">{m.content}</div>
                        </div>
                      ))}
                      {isAILoading && activeTab === 'BACKTEST' && (
                        <div className="flex justify-start">
                          <div style={{ background: tk.input, borderColor: tk.border, color: tk.textMuted }} className="rounded-2xl px-4 py-3 text-[11px] border ai-typing">Processing</div>
                        </div>
                      )}
                    </div>
                    <div style={{ borderColor: tk.border, background: tk.input }} className="p-3 border-t">
                      <div style={{ background: tk.surface, borderColor: tk.border }} className="flex items-center gap-2 rounded-xl border px-3 py-2.5">
                        <input value={backtestInput} onChange={e => setBacktestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendToAI('BACKTEST')}
                          placeholder="Ask about results, optimization..." style={{ color: tk.text, background: 'transparent' }} className="flex-1 text-xs outline-none placeholder:opacity-30"/>
                        <button onClick={() => sendToAI('BACKTEST')} disabled={isAILoading || !backtestInput.trim()}
                          className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40 flex-shrink-0" style={{ backgroundColor: '#3b82f6' }}>
                          <Send size={12} className="text-white"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════════════════╗
                  ║  PLAYBOOK                                        ║
                  ╚══════════════════════════════════════════════════╝ */}
              {activeTab === 'PLAYBOOK' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 style={{ color: tk.text }} className="text-2xl md:text-3xl font-black italic tracking-tighter">NEURAL PLAYBOOK</h2>
                      <p style={{ color: tk.textDim }} className="text-[8px] font-bold uppercase tracking-[0.3em] mt-1">Strategy Library</p>
                    </div>
                    <button onClick={() => setIsCreatingStrategy(true)} style={{ backgroundColor: brand }} className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl text-white hover:opacity-90 transition-all flex items-center gap-2">
                      <Plus size={13}/> New Strategy
                    </button>
                  </div>

                  {isCreatingStrategy && (
                    <div style={{ background: tk.surface, borderColor: `${brand}40` }} className="rounded-2xl border-2 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 style={{ color: tk.text }} className="text-base font-black uppercase">Create Strategy</h3>
                        <button onClick={() => setIsCreatingStrategy(false)} style={{ color: tk.textMuted }}><X size={16}/></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input placeholder="Strategy Name" value={newStrategy.name} onChange={e => setNewStrategy(s => ({ ...s, name: e.target.value }))}
                          style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all"/>
                        <select value={newStrategy.timeframe} onChange={e => setNewStrategy(s => ({ ...s, timeframe: e.target.value }))}
                          style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all">
                          {['1M','5M','15M','30M','1H','4H','D1'].map(tf => <option key={tf} value={tf}>{tf}</option>)}
                        </select>
                      </div>
                      <textarea rows={2} placeholder="Strategy description..." value={newStrategy.description} onChange={e => setNewStrategy(s => ({ ...s, description: e.target.value }))}
                        style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm outline-none resize-none focus:border-brand transition-all"/>
                      <div>
                        <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block mb-2">Add Confluences</label>
                        <div className="flex gap-2 mb-2">
                          <input placeholder="e.g. FVG Present" value={newStrategy.newConfluence} onChange={e => setNewStrategy(s => ({ ...s, newConfluence: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter' && newStrategy.newConfluence.trim()) setNewStrategy(s => ({ ...s, confluences: [...s.confluences, s.newConfluence.trim()], newConfluence: '' })); }}
                            style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="flex-1 rounded-xl border p-3 text-sm outline-none focus:border-brand transition-all"/>
                          <button onClick={() => { if (newStrategy.newConfluence.trim()) setNewStrategy(s => ({ ...s, confluences: [...s.confluences, s.newConfluence.trim()], newConfluence: '' })); }}
                            style={{ backgroundColor: brand }} className="px-4 py-2 rounded-xl text-white text-[9px] font-black uppercase">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newStrategy.confluences.map((c, i) => (
                            <span key={i} style={{ backgroundColor: `${brand}20`, color: brand, borderColor: `${brand}40` }} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black border">
                              {c} <button onClick={() => setNewStrategy(s => ({ ...s, confluences: s.confluences.filter((_, j) => j !== i) }))}><X size={9}/></button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => {
                        if (!newStrategy.name.trim()) return;
                        const s = { id: Date.now(), name: newStrategy.name, timeframe: newStrategy.timeframe, description: newStrategy.description, confluences: newStrategy.confluences, grading: { 'A+': [], A: [], 'B+': [], B: [] }, active: true };
                        setPlaybook(p => { const u = [...p, s]; localStorage.setItem('tradesylla_playbook', JSON.stringify(u)); return u; });
                        setIsCreatingStrategy(false); setNewStrategy({ name: '', timeframe: '15M', description: '', confluences: [], newConfluence: '' });
                      }} style={{ backgroundColor: brand }} className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white">
                        Save to Playbook
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {playbook.map(strat => (
                      <div key={strat.id} style={{ background: tk.surface, borderColor: selectedPlaybookId === strat.id ? brand : tk.border }}
                        className="rounded-2xl border p-5 cursor-pointer transition-all hover:border-brand/50"
                        onClick={() => setSelectedPlaybookId(selectedPlaybookId === strat.id ? null : strat.id)}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 style={{ color: tk.text }} className="text-base font-black italic">{strat.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span style={{ backgroundColor: `${brand}20`, color: brand }} className="px-2 py-0.5 rounded-full text-[7px] font-black">{strat.timeframe}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[7px] font-black ${strat.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{strat.active ? 'Active' : 'Paused'}</span>
                            </div>
                          </div>
                        </div>
                        <p style={{ color: tk.textMuted }} className="text-[9px] leading-relaxed mb-3">{strat.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {strat.confluences.slice(0, 4).map((c, i) => <span key={i} style={{ background: tk.input, color: tk.textMuted, borderColor: tk.border }} className="px-2 py-0.5 rounded-full text-[7px] border">{c}</span>)}
                          {strat.confluences.length > 4 && <span style={{ color: tk.textDim }} className="text-[7px]">+{strat.confluences.length - 4}</span>}
                        </div>
                        <div style={{ borderColor: tk.border }} className="border-t pt-3">
                          <div className="grid grid-cols-4 gap-1 mb-3">
                            {['A+','A','B+','B'].map((g, gi) => (
                              <div key={g} style={{ background: tk.input, borderColor: gi === 0 ? brand : tk.border }} className="rounded-lg border p-1.5 text-center">
                                <p style={{ color: gi === 0 ? brand : tk.textMuted }} className="text-[8px] font-black">{g}</p>
                              </div>
                            ))}
                          </div>
                          {selectedPlaybookId === strat.id && (
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={e => { e.stopPropagation(); setActiveTab('BACKTEST'); setBacktestForm(f => ({ ...f, strategyDesc: strat.description, confluences: strat.confluences.join(', ') })); }}
                                style={{ borderColor: tk.border, color: tk.textMuted }} className="py-2 rounded-xl border text-[8px] font-black uppercase hover:border-brand hover:text-brand transition-all">
                                → Backtest
                              </button>
                              <button onClick={e => { e.stopPropagation(); setActiveTab('SYLLEDGE'); setSylledgeInput(`Analyze my ${strat.name} strategy`); }}
                                style={{ backgroundColor: `${brand}20`, color: brand }} className="py-2 rounded-xl text-[8px] font-black uppercase hover:opacity-80 transition-all">
                                → Sylledge AI
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════════════════╗
                  ║  TRADE LOG                                       ║
                  ╚══════════════════════════════════════════════════╝ */}
              {activeTab === 'TRADE_LOG' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 style={{ color: tk.text }} className="text-2xl md:text-3xl font-black italic tracking-tighter">TRADE LOG</h2>
                      <p style={{ color: tk.textDim }} className="text-[8px] font-bold uppercase tracking-[0.3em]">Execution Data</p>
                    </div>
                    <div className="flex gap-2">
                      <label style={{ borderColor: tk.border, color: tk.textMuted }} className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[8px] font-black uppercase cursor-pointer hover:border-brand transition-all">
                        <Upload size={12}/> Import CSV <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden"/>
                      </label>
                      <button onClick={syncLiveMT5} disabled={isSyncing} style={{ backgroundColor: brand }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[8px] font-black uppercase text-white hover:opacity-90 transition-all disabled:opacity-50">
                        <Database size={12}/> {isSyncing ? 'Syncing...' : 'Sync MT5'}
                      </button>
                    </div>
                  </div>
                  <div style={{ background: tk.surface, borderColor: tk.border }} className="flex flex-wrap gap-4 p-3 rounded-2xl border items-center">
                    {[
                      { label: 'Asset',     key: 'asset',     opts: ['ALL','XAUUSD','NAS100','GER40','UKOIL'] },
                      { label: 'Strategy',  key: 'strategy',  opts: ['ALL', ...playbook.map(s => s.name)] },
                      { label: 'Direction', key: 'direction', opts: ['ALL','LONG','SHORT'] },
                    ].map(f => (
                      <div key={f.key} className="flex flex-col">
                        <label style={{ color: brand }} className="text-[6px] font-black uppercase mb-1">{f.label}</label>
                        <select value={filters[f.key]} onChange={e => setFilters(v => ({ ...v, [f.key]: e.target.value }))}
                          style={{ background: 'transparent', color: tk.text }} className="text-[9px] font-black uppercase outline-none cursor-pointer">
                          {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border overflow-hidden">
                    <div className="table-wrapper">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: tk.input, borderColor: tk.border }} className="border-b">
                            {['Asset','Direction','Grade','Entry','Exit','P&L','Strategy','Date'].map(h => (
                              <th key={h} style={{ color: tk.textDim }} className="px-4 py-3 text-left text-[7px] font-black uppercase tracking-widest">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tradeHistory.length === 0
                            ? <tr><td colSpan={8} style={{ color: tk.textDim }} className="px-4 py-14 text-center text-[9px] font-bold uppercase">No trades logged yet.</td></tr>
                            : tradeHistory.map((t, i) => (
                              <tr key={i} style={{ borderColor: tk.border }} className="border-b last:border-0">
                                <td style={{ color: tk.text }} className="px-4 py-3 text-[9px] font-black">{t.asset}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[7px] font-black ${t.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{t.direction}</span></td>
                                <td className="px-4 py-3"><span style={{ backgroundColor: `${brand}20`, color: brand }} className="px-2 py-0.5 rounded-full text-[7px] font-black">{t.grade}</span></td>
                                <td style={{ color: tk.textMuted }} className="px-4 py-3 text-[9px]">{t.entry}</td>
                                <td style={{ color: tk.textMuted }} className="px-4 py-3 text-[9px]">{t.exit}</td>
                                <td style={{ color: parseFloat(t.pnl) >= 0 ? '#10b981' : '#ef4444', filter: isPrivacyMode ? 'blur(8px)' : 'none' }} className="px-4 py-3 text-[9px] font-black">{parseFloat(t.pnl) >= 0 ? '+' : ''}${t.pnl}</td>
                                <td style={{ color: tk.textMuted }} className="px-4 py-3 text-[9px]">{t.strategy}</td>
                                <td style={{ color: tk.textDim }} className="px-4 py-3 text-[9px]">{t.date}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════════════════╗
                  ║  SETTINGS                                        ║
                  ╚══════════════════════════════════════════════════╝ */}
              {activeTab === 'SETTINGS' && (
                <div className="settings-layout flex gap-5">

                  <div style={{ background: tk.surface, borderColor: tk.border }} className="settings-sidebar w-52 rounded-2xl border p-3 space-y-1 shrink-0 self-start sticky top-24">
                    <p style={{ color: brand }} className="text-[7px] font-black uppercase tracking-[0.3em] px-3 pb-2">System Config</p>
                    {[
                      { id: 'ACCOUNT',      icon: User,       label: 'Account Profile' },
                      { id: 'SECURITY',     icon: ShieldCheck,label: 'Security' },
                      { id: 'NOTIFICATIONS',icon: Bell,       label: 'Notifications' },
                      { id: 'APPEARANCE',   icon: Palette,    label: 'Appearance' },
                      { id: 'PREFERENCES',  icon: Languages,  label: 'Preferences' },
                    ].map(item => (
                      <button key={item.id} onClick={() => setActiveSettingsSubTab(item.id)}
                        style={{ color: activeSettingsSubTab === item.id ? brand : tk.textMuted, backgroundColor: activeSettingsSubTab === item.id ? `${brand}15` : 'transparent', borderColor: activeSettingsSubTab === item.id ? `${brand}40` : 'transparent' }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left hover:bg-white/5">
                        <item.icon size={14}/>
                        <span className="text-[8px] font-black uppercase tracking-wider">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="settings-content flex-1 max-w-2xl space-y-5">

                    {activeSettingsSubTab === 'ACCOUNT' && (
                      <div className="space-y-5">
                        <h3 style={{ color: tk.text }} className="text-xl font-black italic tracking-tighter uppercase">Account Profile</h3>
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-5 space-y-4">
                          <div className="flex items-center gap-4">
                            <div style={{ backgroundColor: `${brand}20`, borderColor: brand }} className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black border-2" style={{ borderColor: brand }}>
                              {profile.name.charAt(0)}
                            </div>
                            <div>
                              <p style={{ color: tk.text }} className="font-black">{profile.name}</p>
                              <p style={{ color: tk.textMuted }} className="text-xs">{profile.email}</p>
                              <button style={{ color: brand }} className="text-[8px] font-black uppercase tracking-wider mt-1">Change Photo</button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { label: 'Display Name', k: 'name',        type: 'text' },
                              { label: 'Email',        k: 'email',       type: 'email' },
                              { label: 'Phone',        k: 'phone',       type: 'tel' },
                              { label: 'Country',      k: 'country',     type: 'text' },
                              { label: 'Broker',       k: 'broker',      type: 'text' },
                            ].map(f => (
                              <div key={f.k} className="space-y-1">
                                <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">{f.label}</label>
                                <input type={f.type} value={profile[f.k]} onChange={e => setProfile(p => ({ ...p, [f.k]: e.target.value }))}
                                  style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all"/>
                              </div>
                            ))}
                            <div className="space-y-1">
                              <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Account Type</label>
                              <select value={profile.accountType} onChange={e => setProfile(p => ({ ...p, accountType: e.target.value }))}
                                style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all">
                                <option>Live</option><option>Demo</option><option>Prop Firm</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Bio</label>
                            <textarea rows={2} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Your trading journey..."
                              style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm outline-none resize-none focus:border-brand transition-all"/>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsSubTab === 'SECURITY' && (
                      <div className="space-y-4">
                        <h3 style={{ color: tk.text }} className="text-xl font-black italic tracking-tighter uppercase">Security</h3>
                        {[
                          { icon: Smartphone, k: 'twoFactor',  label: '2-Factor Authentication', desc: 'Protect your account with 2FA', color: brand },
                          { icon: Bell,       k: 'loginAlerts',label: 'Login Alerts',             desc: 'Notify on new logins',         color: '#3b82f6' },
                        ].map(item => (
                          <div key={item.k} style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div style={{ backgroundColor: `${item.color}20`, color: item.color }} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><item.icon size={16}/></div>
                              <div>
                                <p style={{ color: tk.text }} className="text-sm font-black">{item.label}</p>
                                <p style={{ color: tk.textMuted }} className="text-[8px]">{item.desc}</p>
                              </div>
                            </div>
                            <Toggle value={security[item.k]} onChange={v => setSecurity(s => ({ ...s, [item.k]: v }))}/>
                          </div>
                        ))}
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4 space-y-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Key size={14} style={{ color: brand }}/>
                            <p style={{ color: tk.text }} className="text-sm font-black">Change Password</p>
                          </div>
                          {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm Password']].map(([k, l]) => (
                            <div key={k} className="space-y-1">
                              <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">{l}</label>
                              <input type="password" value={security[k]} onChange={e => setSecurity(s => ({ ...s, [k]: e.target.value }))}
                                style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all"/>
                            </div>
                          ))}
                          <button style={{ backgroundColor: brand }} className="px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-wider text-white hover:opacity-90 transition-all">Update Password</button>
                        </div>
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-4">
                          <p style={{ color: tk.text }} className="text-sm font-black mb-2">Session Timeout</p>
                          <select value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))}
                            style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all">
                            <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="0">Never</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {activeSettingsSubTab === 'NOTIFICATIONS' && (
                      <div className="space-y-4">
                        <h3 style={{ color: tk.text }} className="text-xl font-black italic tracking-tighter uppercase">Notifications</h3>
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border overflow-hidden">
                          {[
                            { k: 'tradeAlerts', l: 'Trade Alerts',   d: 'Notify when trades are executed' },
                            { k: 'aiInsights',  l: 'AI Insights',    d: 'SYLLEDGE analysis updates' },
                            { k: 'weeklyReport',l: 'Weekly Report',  d: 'Performance summary every Monday' },
                            { k: 'emailDigest', l: 'Email Digest',   d: 'Daily digest via email' },
                          ].map((n, i, arr) => (
                            <div key={n.k} style={{ borderColor: tk.border }} className={`flex items-center justify-between p-4 gap-4 ${i < arr.length - 1 ? 'border-b' : ''}`}>
                              <div>
                                <p style={{ color: tk.text }} className="text-sm font-black">{n.l}</p>
                                <p style={{ color: tk.textMuted }} className="text-[8px]">{n.d}</p>
                              </div>
                              <Toggle value={notifications[n.k]} onChange={v => setNotifications(nt => ({ ...nt, [n.k]: v }))}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSettingsSubTab === 'APPEARANCE' && (
                      <div className="space-y-5">
                        <h3 style={{ color: tk.text }} className="text-xl font-black italic tracking-tighter uppercase">Appearance</h3>
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-5 space-y-4">
                          <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block">Interface Theme</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[{ id: 'dark', label: 'Dark', preview: '#020408' }, { id: 'light', label: 'Light', preview: '#f0f4f8' }, { id: 'cyber', label: 'Cyber', preview: '#000a14' }].map(t => (
                              <button key={t.id} onClick={() => setAppearance(a => ({ ...a, mode: t.id }))}
                                style={{ borderColor: appearance.mode === t.id ? brand : tk.border, backgroundColor: appearance.mode === t.id ? `${brand}15` : tk.input }}
                                className="p-3 rounded-xl border transition-all flex flex-col items-center gap-2">
                                <div style={{ backgroundColor: t.preview }} className="w-full h-8 rounded-lg border border-white/10"/>
                                <span style={{ color: appearance.mode === t.id ? brand : tk.textMuted }} className="text-[8px] font-black uppercase">{t.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-5 space-y-3">
                          <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest block">Brand Color</label>
                          <div className="flex flex-wrap gap-3 items-center">
                            {['#a855f7','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4'].map(c => (
                              <button key={c} onClick={() => setAppearance(a => ({ ...a, primaryColor: c }))}
                                style={{ backgroundColor: c, outline: appearance.primaryColor === c ? '3px solid white' : '3px solid transparent', outlineOffset: '2px' }}
                                className="w-9 h-9 rounded-full transition-transform hover:scale-110"/>
                            ))}
                            <div className="relative w-9 h-9 rounded-full overflow-hidden border" style={{ borderColor: tk.border }}>
                              <Plus size={12} className="absolute inset-0 m-auto pointer-events-none" style={{ color: tk.textMuted }}/>
                              <input type="color" value={appearance.primaryColor} onChange={e => setAppearance(a => ({ ...a, primaryColor: e.target.value }))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scale-150"/>
                            </div>
                          </div>
                        </div>
                        {/* Live preview */}
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-5 relative overflow-hidden">
                          <div style={{ backgroundColor: `${brand}20` }} className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none"/>
                          <p style={{ color: tk.text }} className="text-[9px] font-black uppercase tracking-widest mb-3">Live Preview</p>
                          <div className="flex gap-3 items-center">
                            <div style={{ backgroundColor: brand }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                              <Zap size={18} className="text-white fill-white"/>
                            </div>
                            <div>
                              <p style={{ color: tk.text }} className="text-sm font-black">TRADESYLLA</p>
                              <p style={{ color: brand }} className="text-[8px] font-black uppercase tracking-widest">Neural Elite</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsSubTab === 'PREFERENCES' && (
                      <div className="space-y-4">
                        <h3 style={{ color: tk.text }} className="text-xl font-black italic tracking-tighter uppercase">Preferences</h3>
                        <div style={{ background: tk.surface, borderColor: tk.border }} className="rounded-2xl border p-5 space-y-4">
                          {[
                            { label: 'Language', k: 'language', opts: [['EN','English'],['FR','Français'],['ES','Español']] },
                            { label: 'Timezone', k: 'timezone', opts: [['UTC','UTC'],['EST','EST'],['GMT','GMT'],['CET','CET']] },
                            { label: 'Currency', k: 'currency', opts: [['USD','USD ($)'],['EUR','EUR (€)'],['GBP','GBP (£)']] },
                          ].map(f => (
                            <div key={f.k} className="space-y-1">
                              <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">{f.label}</label>
                              <select value={profile[f.k] || f.opts[0][0]} onChange={e => setProfile(p => ({ ...p, [f.k]: e.target.value }))}
                                style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all">
                                {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={handleSaveSettings} disabled={isSyncing} className="px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 bg-white text-black">
                      {isSyncing ? '✓ Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>

        {/* ── TRADE MODAL ────────────────────────────────────────────────────── */}
        {isLogModalOpen && (
          <div className="modal-wrap fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" onClick={() => setIsLogModalOpen(false)}/>
            <div style={{ backgroundColor: tk.bg, borderColor: tk.border }} className="modal-inner relative w-full max-w-5xl rounded-[28px] border overflow-hidden flex flex-col max-h-[94vh]">
              <div style={{ borderColor: tk.border, background: tk.surface }} className="p-5 border-b flex items-center justify-between">
                <div>
                  <h3 style={{ color: tk.text }} className="text-lg font-black italic tracking-tighter">LOG NEW POSITION</h3>
                  <p style={{ color: tk.textDim }} className="text-[8px] font-bold uppercase tracking-[0.3em]">Neural Trade Entry</p>
                </div>
                <button onClick={() => setIsLogModalOpen(false)} style={{ background: tk.input, color: tk.textMuted }} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"><X size={16}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="modal-grid grid grid-cols-1 lg:grid-cols-2 gap-5">

                  {/* LEFT */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Trade Date</label>
                        <input type="date" value={tradeForm.date} onChange={e => setTradeForm(t => ({ ...t, date: e.target.value }))}
                          style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all [color-scheme:dark]"/>
                      </div>
                      <div className="space-y-1">
                        <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Asset</label>
                        <input type="text" value={tradeForm.asset} onChange={e => setTradeForm(t => ({ ...t, asset: e.target.value }))} placeholder="XAUUSD"
                          style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all"/>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Setup Grade</label>
                      <div className="flex gap-2">
                        {['A+','A','B+','B'].map(g => (
                          <button key={g} onClick={() => setTradeForm(t => ({ ...t, grade: g }))}
                            style={{ backgroundColor: tradeForm.grade === g ? brand : tk.input, borderColor: tradeForm.grade === g ? brand : tk.border, color: tradeForm.grade === g ? 'white' : tk.textMuted }}
                            className="flex-1 py-2.5 rounded-xl border text-[9px] font-black transition-all">{g}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Direction</label>
                      <div className="flex gap-2">
                        {['LONG','SHORT'].map(d => (
                          <button key={d} onClick={() => setTradeForm(t => ({ ...t, direction: d }))}
                            style={{ backgroundColor: tradeForm.direction === d ? (d === 'LONG' ? '#10b981' : '#ef4444') : tk.input, borderColor: tradeForm.direction === d ? (d === 'LONG' ? '#10b981' : '#ef4444') : tk.border, color: tradeForm.direction === d ? 'white' : tk.textMuted }}
                            className="flex-1 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all">{d}</button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[['Entry','entry'],['Exit','exit'],['Stop Loss','sl'],['Take Profit','tp'],['R:R','rr'],['P&L ($)','pnl']].map(([l, k]) => (
                        <div key={k} className="space-y-1">
                          <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">{l}</label>
                          <input type="text" value={tradeForm[k]} onChange={e => setTradeForm(t => ({ ...t, [k]: e.target.value }))} placeholder="0.00"
                            style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all"/>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Strategy</label>
                      <select value={tradeForm.strategy} onChange={e => setTradeForm(t => ({ ...t, strategy: e.target.value }))}
                        style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none focus:border-brand transition-all">
                        <option value="">Select Strategy</option>
                        {playbook.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Strategy Narrative</label>
                      <textarea rows={3} value={tradeForm.narrative} onChange={e => setTradeForm(t => ({ ...t, narrative: e.target.value }))} placeholder="Why is this an A+? Describe your confluence..."
                        style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none resize-none focus:border-brand transition-all"/>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Chart Screenshot</label>
                      <div onClick={() => document.getElementById('chartImgInput').click()}
                        style={{ borderColor: tk.border, background: tk.input }} className="aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-all relative overflow-hidden group">
                        {entryImagePreview
                          ? <img src={entryImagePreview} className="w-full h-full object-cover" alt="Chart"/>
                          : <><ImageIcon size={24} style={{ color: tk.textDim }} className="group-hover:text-brand transition-colors mb-2"/><p style={{ color: tk.textDim }} className="text-[8px] font-black uppercase tracking-widest group-hover:text-brand transition-colors">Upload Chart</p></>
                        }
                        <input id="chartImgInput" type="file" accept="image/*" className="hidden" onChange={handleImageSelect}/>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Import MT5 CSV</label>
                      <label style={{ borderColor: tk.border, background: tk.input }} className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer hover:border-brand transition-all">
                        <div style={{ backgroundColor: `${brand}20`, color: brand }} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"><Upload size={14}/></div>
                        <div>
                          <p style={{ color: tk.text }} className="text-[9px] font-black uppercase">Sync MT5 History</p>
                          <p style={{ color: tk.textDim }} className="text-[7px]">Drop exported .csv report</p>
                        </div>
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden"/>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">TradingView URL</label>
                      <div style={{ background: tk.input, borderColor: tk.border }} className="flex items-center gap-2 rounded-xl border px-3">
                        <Globe size={12} style={{ color: tk.textDim }}/>
                        <input type="text" value={tradeForm.chartUrl} onChange={e => setTradeForm(t => ({ ...t, chartUrl: e.target.value }))} placeholder="Paste chart URL..."
                          style={{ background: 'transparent', color: tk.text }} className="flex-1 py-3 text-sm font-bold outline-none"/>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Mindset Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {['Disciplined','FOMO','Confident','Zen','Revenge','Patient','Rushed'].map(tag => (
                          <button key={tag} onClick={() => setTradeForm(t => ({ ...t, mindsetTags: t.mindsetTags.includes(tag) ? t.mindsetTags.filter(x => x !== tag) : [...t.mindsetTags, tag] }))}
                            style={{ backgroundColor: tradeForm.mindsetTags.includes(tag) ? `${brand}20` : tk.input, borderColor: tradeForm.mindsetTags.includes(tag) ? brand : tk.border, color: tradeForm.mindsetTags.includes(tag) ? brand : tk.textMuted }}
                            className="px-3 py-1.5 rounded-lg border text-[7px] font-black uppercase transition-all">
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label style={{ color: tk.textMuted }} className="text-[7px] font-black uppercase tracking-widest">Psychological Note</label>
                      <textarea rows={4} value={tradeForm.psychNarrative} onChange={e => setTradeForm(t => ({ ...t, psychNarrative: e.target.value }))} placeholder="State of mind, discipline check..."
                        style={{ background: tk.input, borderColor: tk.border, color: tk.text }} className="w-full rounded-xl border p-3 text-sm font-bold outline-none resize-none focus:border-brand transition-all"/>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderColor: tk.border, background: tk.surface }} className="p-5 border-t">
                <button onClick={handleCommitTrade} className="w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Commit Position to TRADESYLLA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FAB (bottom right only) ────────────────────────────────────────── */}
        <button onClick={() => setIsLogModalOpen(true)}
          className="fab-btn fixed bottom-8 right-8 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_16px_40px_rgba(255,255,255,0.25)] hover:scale-110 active:scale-90 transition-all z-50 group">
          <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500"/>
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-15 pointer-events-none"/>
        </button>

      </div>
    </>
  );
};

export default TradingTerminal;

/*
═══════════════════════════════════════════════
 CREATE: app/api/ai/route.js
═══════════════════════════════════════════════
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req) {
  const { messages, system } = await req.json();
  try {
    const r = await client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system, messages });
    return Response.json({ content: r.content[0].text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

ADD TO .env.local:
  ANTHROPIC_API_KEY=your_key
  NEXT_PUBLIC_METAAPI_TOKEN=your_token
  NEXT_PUBLIC_METAAPI_ACCOUNT_ID=your_account_id

RUN: npm install @anthropic-ai/sdk
═══════════════════════════════════════════════
*/