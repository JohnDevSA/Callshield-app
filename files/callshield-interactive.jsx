import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Shield, ShieldCheck, ShieldAlert, ShieldX, Search, Ban, Settings, Home, X, ChevronRight, Clock, TrendingUp, AlertTriangle, Building2, Heart, Lock, Check, Bell, Wifi, Database, User, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';

// Reusable Components
const Card = ({ children, className = '', onClick, hoverable = false }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white rounded-2xl border border-slate-100 
      ${hoverable ? 'hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all duration-200' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, icon: Icon }) => {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/25',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/25',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/25',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    outline: 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      onClick={onClick}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-xl font-medium transition-all duration-200 
        flex items-center justify-center gap-2
        active:scale-[0.98]
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  );
};

const IconButton = ({ icon: Icon, variant = 'ghost', size = 'md', onClick, badge }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const iconSizes = { sm: 16, md: 20, lg: 24 };
  const variants = {
    ghost: 'hover:bg-slate-100 text-slate-500',
    primary: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  };

  return (
    <button 
      onClick={onClick}
      className={`${sizes[size]} ${variants[variant]} rounded-xl flex items-center justify-center transition-all duration-200 relative`}
    >
      <Icon size={iconSizes[size]} />
      {badge && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {badge}
        </span>
      )}
    </button>
  );
};

const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'lookup', icon: Search, label: 'Lookup' },
    { id: 'blocked', icon: Ban, label: 'Blocked' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 pb-4 pt-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200
              ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className={`text-xs ${activeTab === tab.id ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const CallHistoryItem = ({ call, onClick }) => {
  const getStatusIcon = () => {
    switch (call.type) {
      case 'spam_high': return <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><ShieldAlert className="text-red-500" size={20} /></div>;
      case 'spam_low': return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"><AlertTriangle className="text-amber-500" size={20} /></div>;
      case 'verified': return <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><ShieldCheck className="text-emerald-500" size={20} /></div>;
      case 'contact': return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">{call.name?.charAt(0) || '?'}</div>;
      case 'blocked': return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Ban className="text-slate-400" size={20} /></div>;
      default: return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Phone className="text-slate-400" size={20} /></div>;
    }
  };

  const getDirectionIcon = () => {
    if (call.direction === 'incoming') return <PhoneIncoming size={12} className="text-emerald-500" />;
    if (call.direction === 'outgoing') return <PhoneOutgoing size={12} className="text-blue-500" />;
    if (call.direction === 'missed') return <PhoneMissed size={12} className="text-red-500" />;
    return null;
  };

  return (
    <div onClick={onClick} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors duration-150 group">
      {getStatusIcon()}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium truncate ${call.type === 'spam_high' ? 'text-red-600' : 'text-slate-800'}`}>
            {call.name || call.number}
          </span>
          {call.verified && <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {getDirectionIcon()}
          <span>{call.subtitle || call.number}</span>
          {call.subtitle && <span>•</span>}
          <span>{call.time}</span>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
    </div>
  );
};

const StatusCard = ({ blockedCount, lastSync }) => (
  <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} />
          <span className="font-medium text-blue-100">Protected</span>
        </div>
        <div className="text-3xl font-bold mb-1">{blockedCount}</div>
        <div className="text-sm text-blue-200">spam calls blocked this week</div>
      </div>
      <div className="text-right text-sm text-blue-200">
        <div className="flex items-center gap-1 justify-end">
          <Wifi size={12} />
          <span>Synced</span>
        </div>
        <div>{lastSync}</div>
      </div>
    </div>
  </Card>
);

const IncomingCallOverlay = ({ call, onAnswer, onDecline, onBlock }) => {
  const getOverlayStyle = () => {
    switch (call.type) {
      case 'spam_high': return { bg: 'from-red-600 to-red-700' };
      case 'spam_low': return { bg: 'from-amber-500 to-amber-600' };
      case 'verified': return { bg: 'from-emerald-500 to-emerald-600' };
      default: return { bg: 'from-slate-700 to-slate-800' };
    }
  };

  const style = getOverlayStyle();

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${style.bg} flex flex-col z-50`}>
      {call.type === 'spam_high' && (
        <div className="bg-white/20 backdrop-blur-sm mx-4 mt-8 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldAlert className="text-white" size={22} />
          </div>
          <div>
            <div className="text-white font-semibold">Likely Spam</div>
            <div className="text-white/80 text-sm">{call.reports} people reported this number</div>
          </div>
        </div>
      )}
      
      {call.type === 'spam_low' && (
        <div className="bg-white/20 backdrop-blur-sm mx-4 mt-8 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <AlertTriangle className="text-white" size={22} />
          </div>
          <div>
            <div className="text-white font-semibold">Possible Spam</div>
            <div className="text-white/80 text-sm">{call.reports} spam reports</div>
          </div>
        </div>
      )}
      
      {call.type === 'verified' && (
        <div className="bg-white/20 backdrop-blur-sm mx-4 mt-8 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div>
            <div className="text-white font-semibold">Verified Business</div>
            <div className="text-white/80 text-sm">{call.category}</div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className={`w-24 h-24 rounded-full ${call.type === 'contact' ? 'bg-white/20' : 'bg-white/10'} flex items-center justify-center mb-5`}>
          {call.type === 'contact' ? (
            <span className="text-4xl font-bold text-white">{call.name?.charAt(0)}</span>
          ) : call.type === 'verified' ? (
            <Building2 size={40} className="text-white/80" />
          ) : call.type === 'private' ? (
            <Lock size={40} className="text-white/80" />
          ) : (
            <Phone size={40} className="text-white/80" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {call.name || call.number}
        </h1>
        
        {call.name && call.number !== call.name && (
          <p className="text-white/70 text-lg font-mono mb-2">{call.number}</p>
        )}
        
        {call.type === 'private' && (
          <p className="text-white/70">Caller ID withheld</p>
        )}
        
        {call.type === 'no_data' && (
          <p className="text-white/60 text-sm mt-2">No data available</p>
        )}

        {(call.type === 'spam_high' || call.type === 'spam_low') && call.category && (
          <div className="mt-3 px-4 py-1.5 bg-white/20 rounded-full">
            <span className="text-white/90 text-sm font-medium">{call.category}</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-4">
        {(call.type === 'spam_high' || call.type === 'spam_low') && (
          <button 
            onClick={onBlock}
            className="w-full mb-4 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Ban size={20} />
            Block & Report
          </button>
        )}
        
        <div className="flex gap-4">
          <button 
            onClick={onDecline}
            className="flex-1 py-4 bg-red-500 hover:bg-red-600 rounded-2xl flex flex-col items-center gap-1.5 transition-all shadow-lg shadow-red-500/30"
          >
            <PhoneOff size={26} className="text-white" />
            <span className="text-white font-medium text-sm">Decline</span>
          </button>
          
          <button 
            onClick={onAnswer}
            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex flex-col items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/30"
          >
            <Phone size={26} className="text-white" />
            <span className="text-white font-medium text-sm">Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PostCallFeedback = ({ number, onSafe, onSpam, onDismiss }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
    <div className="bg-white w-full rounded-t-3xl p-6 pb-8">
      <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
      
      <h2 className="text-xl font-bold text-slate-800 text-center mb-2">How was that call?</h2>
      <p className="text-slate-500 text-center mb-5 font-mono text-sm">{number}</p>
      
      <div className="flex gap-3 mb-4">
        <button 
          onClick={onSafe}
          className="flex-1 py-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 border-transparent hover:border-emerald-200"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={24} className="text-emerald-600" />
          </div>
          <span className="text-emerald-700 font-semibold">Safe</span>
        </button>
        
        <button 
          onClick={onSpam}
          className="flex-1 py-4 bg-red-50 hover:bg-red-100 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 border-transparent hover:border-red-200"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldX size={24} className="text-red-600" />
          </div>
          <span className="text-red-700 font-semibold">Spam</span>
        </button>
      </div>
      
      <button onClick={onDismiss} className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors">
        Dismiss
      </button>
    </div>
  </div>
);

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-24 left-4 right-4 z-50 animate-fade-in">
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <Check size={18} className="text-emerald-400" />
        <span className="font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white">
        <X size={18} />
      </button>
    </div>
  </div>
);

const LookupScreen = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      if (query.includes('11')) {
        setResult({ type: 'spam_high', number: query || '+27 11 234 5678', spamScore: 78, reports: 847, category: 'Telemarketer' });
      } else if (query.includes('87')) {
        setResult({ type: 'verified', number: query || '+27 87 575 9404', name: 'FNB Customer Service', category: 'Bank', verified: true });
      } else {
        setResult({ type: 'no_data', number: query });
      }
      setSearching(false);
    }, 600);
  };

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-5">Lookup Number</h1>
      
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="tel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter phone number..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all font-mono"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResult(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        )}
      </div>
      
      <Button onClick={handleSearch} className="w-full mb-6" size="lg" icon={Search}>
        {searching ? 'Searching...' : 'Search'}
      </Button>

      {result && (
        <Card className="overflow-hidden">
          {result.type === 'spam_high' && (
            <div className="bg-red-500 p-4 flex items-center gap-3">
              <ShieldAlert className="text-white" size={22} />
              <span className="text-white font-semibold">Likely Spam</span>
            </div>
          )}
          {result.type === 'verified' && (
            <div className="bg-emerald-500 p-4 flex items-center gap-3">
              <ShieldCheck className="text-white" size={22} />
              <span className="text-white font-semibold">Verified Business</span>
            </div>
          )}
          {result.type === 'no_data' && (
            <div className="bg-slate-500 p-4 flex items-center gap-3">
              <Phone className="text-white" size={22} />
              <span className="text-white font-semibold">No Data</span>
            </div>
          )}
          
          <div className="p-5">
            <p className="font-mono text-lg text-slate-800 mb-1">{result.number}</p>
            {result.name && <p className="text-lg font-semibold text-slate-700 mb-4">{result.name}</p>}
            
            {result.type === 'spam_high' && (
              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="text-slate-800 font-medium">{result.category}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Spam Score</span><span className="text-red-600 font-semibold">{result.spamScore}/100</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Reports</span><span className="text-slate-800 font-medium">{result.reports}</span></div>
              </div>
            )}
            
            {result.type === 'verified' && (
              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="text-slate-800 font-medium">{result.category}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-emerald-600 font-medium flex items-center gap-1"><Check size={14} /> Verified</span></div>
              </div>
            )}
            
            {result.type === 'no_data' && (
              <p className="text-slate-500 text-sm mb-5">We don't have information about this number yet.</p>
            )}
            
            <div className="space-y-2">
              {result.type === 'spam_high' && <Button variant="danger" className="w-full" icon={Ban}>Block Number</Button>}
              {result.type === 'verified' && <Button variant="success" className="w-full" icon={Phone}>Call</Button>}
              <Button variant="outline" className="w-full">Report as Spam</Button>
            </div>
          </div>
        </Card>
      )}
      
      {!result && !searching && (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">Check any number before calling back</p>
          <p className="text-slate-400 text-xs mt-2">Try: numbers with "11" (spam) or "87" (verified)</p>
        </div>
      )}
    </div>
  );
};

const SettingsScreen = () => {
  const [autoBlock, setAutoBlock] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);

  const Toggle = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-all duration-200 ${enabled ? 'bg-blue-500' : 'bg-slate-200'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-5">Settings</h1>
      
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Account</p>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">+27 82 123 4567</p>
            <p className="text-sm text-slate-500">Verified</p>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </Card>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Protection</p>
        <Card className="divide-y divide-slate-100">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 text-sm">Auto-block spam</p>
              <p className="text-xs text-slate-500">Block high confidence spam</p>
            </div>
            <Toggle enabled={autoBlock} onToggle={() => setAutoBlock(!autoBlock)} />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 text-sm">Wi-Fi only sync</p>
              <p className="text-xs text-slate-500">Save mobile data</p>
            </div>
            <Toggle enabled={wifiOnly} onToggle={() => setWifiOnly(!wifiOnly)} />
          </div>
        </Card>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Database</p>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Status</span>
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1"><Check size={14} /> Up to date</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Spam numbers</span>
            <span className="text-sm text-slate-800 font-medium">523,847</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Size</span>
            <span className="text-sm text-slate-800 font-medium">127 MB</span>
          </div>
        </Card>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">About</p>
        <Card className="divide-y divide-slate-100">
          {['Privacy Policy', 'Terms of Service'].map((item) => (
            <div key={item} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <p className="font-medium text-slate-800 text-sm">{item}</p>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          ))}
          <div className="p-4 flex items-center justify-between">
            <p className="font-medium text-slate-800 text-sm">Version</p>
            <p className="text-slate-500 text-sm">1.0.0</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const BlockedScreen = ({ onUnblock }) => {
  const blocked = [
    { number: '+27 11 234 5678', reason: 'Telemarketer', date: '2 days ago' },
    { number: '+27 21 555 6789', reason: 'Scam attempt', date: '1 week ago' },
    { number: '+27 11 111 2222', reason: 'Debt collector', date: '2 weeks ago' },
  ];

  return (
    <div className="px-5 pt-10 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Blocked</h1>
        <Button variant="secondary" size="sm" icon={Ban}>Add</Button>
      </div>

      <Card className="divide-y divide-slate-50">
        {blocked.map((item, i) => (
          <div key={i} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Ban size={18} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-mono font-medium text-slate-800 text-sm">{item.number}</p>
              <p className="text-xs text-slate-500">{item.reason} • {item.date}</p>
            </div>
            <button onClick={() => onUnblock(item.number)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default function CallShieldApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [incomingCallType, setIncomingCallType] = useState('spam_high');
  const [toast, setToast] = useState(null);

  const mockCalls = [
    { id: 1, type: 'contact', name: 'Mom', number: '+27 82 333 4444', time: '14:32', direction: 'incoming' },
    { id: 2, type: 'spam_high', number: '+27 11 234 5678', subtitle: 'Telemarketer • 847 reports', time: '12:15', direction: 'missed' },
    { id: 3, type: 'verified', name: 'FNB Customer Service', number: '+27 87 575 9404', verified: true, time: 'Yesterday', direction: 'incoming' },
    { id: 4, type: 'no_data', number: '+27 82 999 8888', time: 'Yesterday', direction: 'missed' },
    { id: 5, type: 'spam_low', number: '+27 21 555 6789', subtitle: '12 reports', time: 'Monday', direction: 'missed' },
  ];

  const incomingCallData = {
    spam_high: { type: 'spam_high', number: '+27 11 234 5678', category: 'Telemarketer', reports: 847 },
    spam_low: { type: 'spam_low', number: '+27 21 555 6789', category: 'Unknown', reports: 12 },
    verified: { type: 'verified', number: '+27 87 575 9404', name: 'FNB Customer Service', category: 'Bank' },
    contact: { type: 'contact', number: '+27 82 333 4444', name: 'Mom' },
    no_data: { type: 'no_data', number: '+27 82 999 8888' },
    private: { type: 'private', number: 'Private Number' },
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const HomeScreen = () => (
    <div className="px-5 pt-10 pb-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">CallShield</h1>
        </div>
        <div className="flex gap-1">
          <IconButton icon={Bell} badge={2} size="sm" />
        </div>
      </div>

      <div className="mb-5">
        <StatusCard blockedCount={23} lastSync="2h ago" />
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Test Incoming Calls</p>
        <div className="flex flex-wrap gap-1.5">
          {['spam_high', 'spam_low', 'verified', 'contact', 'no_data', 'private'].map((type) => (
            <button
              key={type}
              onClick={() => { setIncomingCallType(type); setShowIncomingCall(true); }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors capitalize"
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Calls</p>
          <button className="text-xs text-blue-500 font-medium">See all</button>
        </div>
        <Card className="divide-y divide-slate-50">
          {mockCalls.map(call => (
            <CallHistoryItem key={call.id} call={call} />
          ))}
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative overflow-hidden">
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'lookup' && <LookupScreen />}
      {activeTab === 'blocked' && <BlockedScreen onUnblock={(num) => showToast(`Unblocked ${num}`)} />}
      {activeTab === 'settings' && <SettingsScreen />}
      
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {showIncomingCall && (
        <IncomingCallOverlay 
          call={incomingCallData[incomingCallType]}
          onAnswer={() => { setShowIncomingCall(false); setShowFeedback(true); }}
          onDecline={() => setShowIncomingCall(false)}
          onBlock={() => { setShowIncomingCall(false); showToast('Number blocked'); }}
        />
      )}
      
      {showFeedback && (
        <PostCallFeedback 
          number="+27 82 999 8888"
          onSafe={() => { setShowFeedback(false); showToast('Thanks for the feedback!'); }}
          onSpam={() => { setShowFeedback(false); showToast('Report submitted'); }}
          onDismiss={() => setShowFeedback(false)}
        />
      )}
      
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
