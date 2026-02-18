import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Mail, Sparkles, Clock, Loader2, Trash2, 
  Search, Copy, CheckCircle, CheckCircle2 
} from 'lucide-react';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/api/tickets');
      setTickets(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Backend offline?");
      setLoading(false);
    }
  };

  const handleGenerateAI = async (id) => {
    try {
      // Portfolio UX: Show immediate loading state within the ticket card
      setTickets(tickets.map(t => t._id === id ? { ...t, isGenerating: true } : t));
      
      const res = await api.post(`/api/tickets/${id}/generate`);
      setTickets(tickets.map(t => t._id === id ? { ...res.data, isGenerating: false } : t));
    } catch (err) {
      alert("AI Service Error - check your backend console.");
      fetchTickets(); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        setTickets(tickets.map(t => t._id === id ? { ...t, status: 'Deleting...' } : t));
        await api.delete(`/api/tickets/${id}`);
        setTickets(tickets.filter(t => t._id !== id));
      } catch (err) {
        alert("Failed to delete the ticket.");
        fetchTickets();
      }
    }
  };

  // Portfolio Feature: PATCH request for status update
  const handleResolve = async (id) => {
    try {
      const res = await api.patch(`/api/tickets/${id}/resolve`);
      setTickets(tickets.map(t => t._id === id ? res.data : t));
    } catch (err) {
      alert("Failed to resolve ticket. Is the backend route ready?");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Inbox</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">
            Manage {tickets.length} active inquiries.
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search tickets..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all w-full md:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {filteredTickets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Mail size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No tickets found</h2>
          <p className="text-slate-400 mt-2 text-sm">Try adjusting your search or wait for new messages.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTickets.map(ticket => (
            <div key={ticket._id} className={`group bg-white border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all ${ticket.status === 'Resolved' ? 'border-emerald-100 opacity-80' : 'border-slate-200 hover:border-orange-200'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-5">
                  <div className={`p-4 rounded-2xl transition-all ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                    {ticket.status === 'Resolved' ? <CheckCircle2 size={24} /> : <Mail size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{ticket.subject}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-400">
                      <span>{ticket.customerEmail}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      
                      {/* --- DYNAMIC STATUS BADGE --- */}
                      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <Clock size={10} /> {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed italic">
                "{ticket.message}"
              </div>

              {ticket.aiResponse && (
                <div className="mt-4 p-5 bg-orange-50 border border-orange-100 rounded-2xl animate-in zoom-in-95 duration-300">
                   <div className="flex justify-between items-center mb-2">
                     <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase">
                       <Sparkles size={14} /> AI Draft
                     </div>
                     <button 
                       onClick={() => copyToClipboard(ticket.aiResponse, ticket._id)}
                       className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-orange-600 transition-colors bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm"
                     >
                       {copiedId === ticket._id ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy Reply</>}
                     </button>
                   </div>
                   <p className="text-slate-700 text-sm leading-relaxed">{ticket.aiResponse}</p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {/* --- GENERATE / REGENERATE BUTTON --- */}
                <button 
                  onClick={() => handleGenerateAI(ticket._id)}
                  disabled={ticket.isGenerating || ticket.status === 'Resolved'}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ticket.isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {ticket.aiResponse ? 'Regenerate' : 'Generate AI Reply'}
                </button>

                {/* --- MARK AS RESOLVED BUTTON --- */}
                {ticket.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleResolve(ticket._id)}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm border border-emerald-100"
                  >
                    <CheckCircle2 size={16} /> Mark as Resolved
                  </button>
                )}

                {/* --- DELETE BUTTON --- */}
                <button 
                  onClick={() => handleDelete(ticket._id)}
                  className="flex items-center gap-2 bg-white border border-slate-200 text-slate-400 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;