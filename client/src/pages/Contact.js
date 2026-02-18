import React, { useState } from 'react';
import api from '../services/api';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tickets', {
        customerEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'Pending'
      });
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed. Check if backend is running!");
    }
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center h-96 text-center animate-in zoom-in-95 duration-500">
      <CheckCircle2 size={80} className="text-emerald-500 mb-6" />
      <h1 className="text-3xl font-black text-slate-900">Message Sent!</h1>
      <p className="text-slate-500 mt-2">Our AI-powered team will get back to you shortly.</p>
      <button onClick={() => setSubmitted(false)} className="mt-8 text-orange-600 font-bold hover:underline">Send another message</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Contact Support</h1>
        <p className="text-slate-500 mt-3 font-medium">How can we help you today?</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
          <input 
            type="email" required
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            placeholder="you@company.com"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
          <input 
            type="text" required
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            placeholder="What's going on?"
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
          <textarea 
            required
            className="w-full p-4 bg-slate-50 border-none rounded-2xl h-40 resize-none focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            placeholder="Tell us the details..."
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
          <Send size={20} /> Send Request
        </button>
      </form>
    </div>
  );
}