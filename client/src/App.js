import React from 'react';
import Contact from './pages/Contact';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Training from './pages/Training';
import { Ticket, Bot, Settings, Zap, LayoutDashboard, ChevronRight } from 'lucide-react';

// This component makes the links change color when you are on that page
const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 translate-x-1' 
          : 'text-slate-500 hover:bg-white hover:text-orange-600 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-orange-600'} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {isActive && <ChevronRight size={16} className="opacity-70" />}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-slate-50/50 backdrop-blur-xl border-r border-slate-200/60 p-6 flex flex-col relative">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 blur-lg opacity-40 rounded-full"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 p-2.5 rounded-2xl shadow-xl">
                <Zap size={24} className="text-white" fill="white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 leading-none">ReplyRabbit</h1>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">Enterprise AI</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2 flex-1">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            <SidebarLink to="/" icon={LayoutDashboard} label="Support Inbox" />
            <SidebarLink to="/training" icon={Bot} label="AI Training" />
          </nav>

          {/* Bottom Profile Card */}
          <div className="mt-auto pt-6 border-t border-slate-200/60">
            <div className="bg-white/80 border border-white p-4 rounded-3xl shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                ZD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">Zain Dev</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-medium text-slate-500">Pro Account</p>
                </div>
              </div>
              <Settings size={16} className="text-slate-400 hover:rotate-90 transition-transform cursor-pointer" />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto relative bg-[#f8fafc]">
          {/* Subtle Decorative Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/40 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-100/30 blur-[100px] rounded-full -z-10"></div>
          
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/training" element={<Training />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;