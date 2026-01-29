import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Shield, ShieldCheck, ShieldAlert, ShieldX, Search, Ban, Settings, Home, X, ChevronRight, Clock, TrendingUp, AlertTriangle, Building2, Heart, Lock, Check, Bell, Wifi, Database, User, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';

// Design tokens
const colors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  neutral: '#64748B',
  neutralLight: '#F1F5F9',
  background: '#FAFBFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
};

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
    xl: 'px-8 py-4 text-lg',
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
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const iconSizes = { sm: 16, md: 20, lg: 24 };
  
  const variants = {
    ghost: 'hover:bg-slate-100 text-slate-500',
    primary: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    success: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
  };

  return (
    <button 
      onClick={onClick}
      className={`
        ${sizes[size]} ${variants[variant]}
        rounded-xl flex items-center justify-center
        transition-all duration-200 relative
      `}
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200
              ${activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-slate-400 hover:text-slate-600'
              }
            `}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className={`text-xs ${activeTab === tab.id ? 'font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Call History Item Component
const CallHistoryItem = ({ call, onClick }) => {
  const getStatusIcon = () => {
    switch (call.type) {
      case 'spam_high':
        return <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><ShieldAlert className="text-red-500" size={20} /></div>;
      case 'spam_low':
        return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"><AlertTriangle className="text-amber-500" size={20} /></div>;
      case 'verified':
        return <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><ShieldCheck className="text-emerald-500" size={20} /></div>;
      case 'contact':
        return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">{call.name?.charAt(0) || '?'}</div>;
      case 'blocked':
        return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Ban className="text-slate-400" size={20} /></div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Phone className="text-slate-400" size={20} /></div>;
    }
  };

  const getDirectionIcon = () => {
    if (call.direction === 'incoming') return <PhoneIncoming size={12} className="text-emerald-500" />;
    if (call.direction === 'outgoing') return <PhoneOutgoing size={12} className="text-blue-500" />;
    if (call.direction === 'missed') return <PhoneMissed size={12} className="text-red-500" />;
    return null;
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors duration-150 group"
    >
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

// Status Card Component
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

// Incoming Call Overlay Component
const IncomingCallOverlay = ({ call, onAnswer, onDecline, onBlock }) => {
  const getOverlayStyle = () => {
    switch (call.type) {
      case 'spam_high':
        return { bg: 'from-red-600 to-red-700', accent: 'red' };
      case 'spam_low':
        return { bg: 'from-amber-500 to-amber-600', accent: 'amber' };
      case 'verified':
        return { bg: 'from-emerald-500 to-emerald-600', accent: 'emerald' };
      default:
        return { bg: 'from-slate-700 to-slate-800', accent: 'slate' };
    }
  };

  const style = getOverlayStyle();

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${style.bg} flex flex-col z-50`}>
      {/* Status indicator */}
      {call.type === 'spam_high' && (
        <div className="bg-white/20 backdrop-blur-sm mx-4 mt-12 rounded-2xl p-4 flex items-center gap-3">
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
        <div className="bg-white/20 backdrop-blur-sm mx-4 mt-12 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <AlertTriangle className="text-white" size={22} />
          </div>
          <div>
            <div className="text-white font-semibold">Possible Spam</div>
            <div className="text-white/80 text-sm">{call.reports} spam reports • Use caution</div>
          </div>
        </div>
      )}
      
      {call.type === 'verified' && (
        <div className="bg-white/20 backdrop-blur-sm mx-4 mt-12 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div>
            <div className="text-white font-semibold">Verified Business</div>
            <div className="text-white/80 text-sm">{call.category}</div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Avatar/Icon */}
        <div className={`w-28 h-28 rounded-full ${call.type === 'contact' ? 'bg-white/20' : 'bg-white/10'} flex items-center justify-center mb-6`}>
          {call.type === 'contact' ? (
            <span className="text-5xl font-bold text-white">{call.name?.charAt(0)}</span>
          ) : call.type === 'verified' ? (
            <Building2 size={48} className="text-white/80" />
          ) : call.type === 'private' ? (
            <Lock size={48} className="text-white/80" />
          ) : (
            <Phone size={48} className="text-white/80" />
          )}
        </div>

        {/* Caller info */}
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          {call.name || call.number}
        </h1>
        
        {call.name && call.number !== call.name && (
          <p className="text-white/70 text-lg font-mono mb-2">{call.number}</p>
        )}
        
        {call.type === 'private' && (
          <p className="text-white/70">Caller ID withheld</p>
        )}
        
        {call.type === 'no_data' && (
          <p className="text-white/60 text-sm mt-2">No data available for this number</p>
        )}

        {/* Spam category */}
        {(call.type === 'spam_high' || call.type === 'spam_low') && call.category && (
          <div className="mt-2 px-4 py-1.5 bg-white/20 rounded-full">
            <span className="text-white/90 text-sm font-medium">{call.category}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-12 pt-6">
        {/* Block button for spam */}
        {(call.type === 'spam_high' || call.type === 'spam_low') && (
          <button 
            onClick={onBlock}
            className="w-full mb-4 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Ban size={20} />
            Block & Report
          </button>
        )}
        
        {/* Answer/Decline buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onDecline}
            className="flex-1 py-5 bg-red-500 hover:bg-red-600 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg shadow-red-500/30"
          >
            <PhoneOff size={28} className="text-white" />
            <span className="text-white font-medium">Decline</span>
          </button>
          
          <button 
            onClick={onAnswer}
            className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg shadow-emerald-500/30"
          >
            <Phone size={28} className="text-white" />
            <span className="text-white font-medium">Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Post-Call Feedback Component
const PostCallFeedback = ({ number, onSafe, onSpam, onDismiss }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
    <div className="bg-white w-full rounded-t-3xl p-6 pb-10 animate-slide-up">
      <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
      
      <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
        How was that call?
      </h2>
      <p className="text-slate-500 text-center mb-6 font-mono">{number}</p>
      
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
      
      <button 
        onClick={onDismiss}
        className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
      >
        Dismiss
      </button>
    </div>
  </div>
);

// Lookup Screen Component
const LookupScreen = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    
    // Simulate search
    setTimeout(() => {
      if (query.includes('082')) {
        setResult({
          type: 'spam_high',
          number: query,
          spamScore: 78,
          reports: 847,
          category: 'Telemarketer',
          firstReported: '3 months ago',
          lastReported: '2 days ago',
        });
      } else if (query.includes('087')) {
        setResult({
          type: 'verified',
          number: query,
          name: 'FNB Customer Service',
          category: 'Bank',
          verified: true,
        });
      } else {
        setResult({
          type: 'no_data',
          number: query,
        });
      }
      setSearching(false);
    }, 800);
  };

  return (
    <div className="px-5 pt-14 pb-28">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Lookup Number</h1>
      
      {/* Search input */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="tel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter phone number"
          className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-mono text-lg"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResult(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <Button onClick={handleSearch} className="w-full mb-8" size="lg" icon={Search}>
        {searching ? 'Searching...' : 'Search'}
      </Button>

      {/* Result */}
      {result && (
        <Card className="overflow-hidden">
          {/* Result header */}
          {result.type === 'spam_high' && (
            <div className="bg-red-500 p-4 flex items-center gap-3">
              <ShieldAlert className="text-white" size={24} />
              <span className="text-white font-semibold text-lg">Likely Spam</span>
            </div>
          )}
          
          {result.type === 'verified' && (
            <div className="bg-emerald-500 p-4 flex items-center gap-3">
              <ShieldCheck className="text-white" size={24} />
              <span className="text-white font-semibold text-lg">Verified Business</span>
            </div>
          )}
          
          {result.type === 'no_data' && (
            <div className="bg-slate-500 p-4 flex items-center gap-3">
              <Phone className="text-white" size={24} />
              <span className="text-white font-semibold text-lg">No Data Available</span>
            </div>
          )}
          
          {/* Result content */}
          <div className="p-5">
            <p className="font-mono text-xl text-slate-800 mb-1">{result.number}</p>
            
            {result.name && (
              <p className="text-lg font-semibold text-slate-700 mb-4">{result.name}</p>
            )}
            
            {result.type === 'spam_high' && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Category</span>
                  <span className="text-slate-800 font-medium">{result.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Spam Score</span>
                  <span className="text-red-600 font-semibold">{result.spamScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Reports</span>
                  <span className="text-slate-800 font-medium">{result.reports}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last reported</span>
                  <span className="text-slate-800">{result.lastReported}</span>
                </div>
              </div>
            )}
            
            {result.type === 'verified' && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Category</span>
                  <span className="text-slate-800 font-medium">{result.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <Check size={14} /> Verified
                  </span>
                </div>
              </div>
            )}
            
            {result.type === 'no_data' && (
              <p className="text-slate-500 text-sm mb-6">
                We don't have information about this number yet. This doesn't mean it's safe or unsafe.
              </p>
            )}
            
            {/* Actions */}
            <div className="space-y-3">
              {result.type === 'spam_high' && (
                <Button variant="danger" className="w-full" icon={Ban}>Block Number</Button>
              )}
              {result.type === 'verified' && (
                <Button variant="success" className="w-full" icon={Phone}>Call</Button>
              )}
              <Button variant="outline" className="w-full" icon={ShieldAlert}>Report as Spam</Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Empty state */}
      {!result && !searching && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500">Check any number before you call back</p>
        </div>
      )}
    </div>
  );
};

// Settings Screen Component
const SettingsScreen = () => {
  const [autoBlock, setAutoBlock] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [postCallPrompt, setPostCallPrompt] = useState(true);

  const Toggle = ({ enabled, onToggle }) => (
    <button 
      onClick={onToggle}
      className={`
        w-12 h-7 rounded-full transition-all duration-200
        ${enabled ? 'bg-blue-500' : 'bg-slate-200'}
      `}
    >
      <div className={`
        w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200
        ${enabled ? 'translate-x-6' : 'translate-x-1'}
      `} />
    </button>
  );

  return (
    <div className="px-5 pt-14 pb-28">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>
      
      {/* Account */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Account</p>
        <Card className="divide-y divide-slate-100">
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">+27 82 123 4567</p>
              <p className="text-sm text-slate-500">Verified</p>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </div>
        </Card>
      </div>

      {/* Call Protection */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Call Protection</p>
        <Card className="divide-y divide-slate-100">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Auto-block spam</p>
              <p className="text-sm text-slate-500">Block high confidence spam automatically</p>
            </div>
            <Toggle enabled={autoBlock} onToggle={() => setAutoBlock(!autoBlock)} />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Post-call prompts</p>
              <p className="text-sm text-slate-500">Ask about unknown callers</p>
            </div>
            <Toggle enabled={postCallPrompt} onToggle={() => setPostCallPrompt(!postCallPrompt)} />
          </div>
        </Card>
      </div>

      {/* Data & Sync */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Data & Sync</p>
        <Card className="divide-y divide-slate-100">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Wi-Fi only sync</p>
              <p className="text-sm text-slate-500">Save mobile data</p>
            </div>
            <Toggle enabled={wifiOnly} onToggle={() => setWifiOnly(!wifiOnly)} />
          </div>
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-800">Database status</p>
              <p className="text-sm text-slate-500">Updated 2 hours ago • 127 MB</p>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </div>
        </Card>
      </div>

      {/* About */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">About</p>
        <Card className="divide-y divide-slate-100">
          {['Privacy Policy', 'Terms of Service', 'Rate the App'].map((item) => (
            <div key={item} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
              <p className="font-medium text-slate-800">{item}</p>
              <ChevronRight size={20} className="text-slate-300" />
            </div>
          ))}
          <div className="p-4 flex items-center justify-between">
            <p className="font-medium text-slate-800">Version</p>
            <p className="text-slate-500">1.0.0</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Main App Component
const CallShieldApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [incomingCallType, setIncomingCallType] = useState('spam_high');

  const mockCalls = [
    { id: 1, type: 'contact', name: 'Mom', number: '+27 82 333 4444', time: '14:32', direction: 'incoming', duration: '5 min' },
    { id: 2, type: 'spam_high', number: '+27 11 234 5678', subtitle: 'Telemarketer • 847 reports', time: '12:15', direction: 'missed' },
    { id: 3, type: 'verified', name: 'FNB Customer Service', number: '+27 87 575 9404', category: 'Bank', verified: true, time: 'Yesterday', direction: 'incoming' },
    { id: 4, type: 'no_data', number: '+27 82 999 8888', time: 'Yesterday', direction: 'missed' },
    { id: 5, type: 'spam_low', number: '+27 21 555 6789', subtitle: '12 reports • Use caution', time: 'Monday', direction: 'missed' },
    { id: 6, type: 'blocked', number: '+27 11 111 2222', subtitle: 'Blocked', time: 'Monday', direction: 'incoming' },
  ];

  const incomingCallData = {
    spam_high: { type: 'spam_high', number: '+27 11 234 5678', category: 'Telemarketer', reports: 847 },
    spam_low: { type: 'spam_low', number: '+27 21 555 6789', category: 'Unknown', reports: 12 },
    verified: { type: 'verified', number: '+27 87 575 9404', name: 'FNB Customer Service', category: 'Bank' },
    contact: { type: 'contact', number: '+27 82 333 4444', name: 'Mom' },
    no_data: { type: 'no_data', number: '+27 82 999 8888' },
    private: { type: 'private', number: 'Private Number' },
  };

  const HomeScreen = () => (
    <div className="px-5 pt-14 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">CallShield</h1>
        </div>
        <div className="flex gap-2">
          <IconButton icon={Bell} badge={2} />
          <IconButton icon={Settings} onClick={() => setActiveTab('settings')} />
        </div>
      </div>

      {/* Status Card */}
      <div className="mb-6">
        <StatusCard blockedCount={23} lastSync="2 hours ago" />
      </div>

      {/* Demo buttons */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Demo: Simulate Incoming Call</p>
        <div className="flex flex-wrap gap-2">
          {['spam_high', 'spam_low', 'verified', 'contact', 'no_data', 'private'].map((type) => (
            <button
              key={type}
              onClick={() => { setIncomingCallType(type); setShowIncomingCall(true); }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors"
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Calls */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Calls</p>
          <button className="text-sm text-blue-500 font-medium">See all</button>
        </div>
        <Card className="divide-y divide-slate-50">
          {mockCalls.map(call => (
            <CallHistoryItem key={call.id} call={call} />
          ))}
        </Card>
      </div>
    </div>
  );

  const BlockedScreen = () => {
    const blockedNumbers = [
      { number: '+27 11 234 5678', reason: 'Telemarketer', date: '2 days ago' },
      { number: '+27 21 555 6789', reason: 'Scam attempt', date: '1 week ago' },
      { number: '+27 11 111 2222', reason: 'Debt collector', date: '2 weeks ago' },
    ];

    return (
      <div className="px-5 pt-14 pb-28">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Blocked</h1>
          <Button variant="secondary" size="sm" icon={Ban}>Add</Button>
        </div>

        <Card className="divide-y divide-slate-50">
          {blockedNumbers.map((item, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Ban size={18} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="font-mono font-medium text-slate-800">{item.number}</p>
                <p className="text-sm text-slate-500">{item.reason} • {item.date}</p>
              </div>
              <IconButton icon={X} size="sm" />
            </div>
          ))}
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Screens */}
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'lookup' && <LookupScreen />}
      {activeTab === 'blocked' && <BlockedScreen />}
      {activeTab === 'settings' && <SettingsScreen />}
      
      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Incoming Call Overlay */}
      {showIncomingCall && (
        <IncomingCallOverlay 
          call={incomingCallData[incomingCallType]}
          onAnswer={() => { setShowIncomingCall(false); setShowFeedback(true); }}
          onDecline={() => setShowIncomingCall(false)}
          onBlock={() => setShowIncomingCall(false)}
        />
      )}
      
      {/* Post-Call Feedback */}
      {showFeedback && (
        <PostCallFeedback 
          number="+27 82 999 8888"
          onSafe={() => setShowFeedback(false)}
          onSpam={() => setShowFeedback(false)}
          onDismiss={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default CallShieldApp;
