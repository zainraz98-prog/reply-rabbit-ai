import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Save, Bot, ShieldCheck, Truck, Info, Sparkles, Clock, CheckCircle } from 'lucide-react';

const Training = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    shippingPolicy: '',
    refundPolicy: '',
    additionalContext: '',
    lastUpdated: null // Added for portfolio tracking
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/api/knowledge');
        if (res.data) setFormData(res.data);
      } catch (err) { 
        console.log("New setup detected - initializing fresh training data"); 
      }
    };
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Syncing to AI Brain...' });
    
    try {
      // We send the current time to the backend to track the "Last Trained" version
      const updatePayload = { ...formData, lastUpdated: new Date() };
      const res = await api.post('/api/knowledge/update', updatePayload);
      
      setFormData(res.data); // Update local state with the saved data from server
      setStatus({ type: 'success', message: 'AI Knowledge Synchronized!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection failed. Check backend.' });
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">AI Training Lab</h1>
          <p className="text-slate-500 font-medium">Fine-tune how your AI interacts with customers.</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-3xl text-orange-600 shadow-inner">
          <Bot size={32} />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Identity Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold text-lg">
              <Sparkles className="text-orange-500" size={20} />
              <h2>Core Identity</h2>
            </div>
            {formData.lastUpdated && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <Clock size={12} /> Last Trained: {new Date(formData.lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
            <input 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold text-slate-700"
              placeholder="e.g., Elite Gadgets Premium"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:border-blue-100">
            <div className="flex items-center gap-3 mb-4 text-slate-800 font-bold">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Truck size={20} /></div>
              <h3>Shipping Policy</h3>
            </div>
            <textarea 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl h-32 resize-none text-sm leading-relaxed font-medium text-slate-600 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g., Free Express Shipping on orders over $100..."
              value={formData.shippingPolicy}
              onChange={(e) => setFormData({...formData, shippingPolicy: e.target.value})}
            />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:border-emerald-100">
            <div className="flex items-center gap-3 mb-4 text-slate-800 font-bold">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500"><ShieldCheck size={20} /></div>
              <h3>Refund Policy</h3>
            </div>
            <textarea 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl h-32 resize-none text-sm leading-relaxed font-medium text-slate-600 focus:ring-2 focus:ring-emerald-400 outline-none"
              placeholder="e.g., 30-day 'No Questions Asked' refund for unopened items..."
              value={formData.refundPolicy}
              onChange={(e) => setFormData({...formData, refundPolicy: e.target.value})}
            />
          </div>
        </div>

        {/* Pro AI Instructions Section */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Bot size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 font-bold text-lg">
              <Info className="text-orange-400" size={22} />
              <h3>Custom AI Behavioral Instructions</h3>
            </div>
            <textarea 
              className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl h-36 resize-none text-sm placeholder:text-white/20 focus:ring-2 focus:ring-orange-500 outline-none leading-relaxed transition-all"
              placeholder="How should the AI behave? (e.g. 'Always use a polite tone', 'If a customer is angry, offer a 10% discount code: SORRY10')"
              value={formData.additionalContext}
              onChange={(e) => setFormData({...formData, additionalContext: e.target.value})}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className={`flex items-center gap-2 text-sm font-bold tracking-tight transition-all duration-300 ${
            status.type === 'success' ? 'text-emerald-500 scale-105' : 
            status.type === 'error' ? 'text-red-500 animate-bounce' : 'text-orange-500'
          }`}>
            {status.type === 'success' && <CheckCircle size={16} />}
            {status.message}
          </div>
          
          <button 
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-slate-300 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
          >
            {status.type === 'loading' ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Save size={20} />}
            Sync AI Knowledge
          </button>
        </div>
      </form>
    </div>
  );
};

export default Training;