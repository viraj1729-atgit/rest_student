import React, { useState, useEffect } from 'react';

const App = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({ name: '', branch: '', year: '' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/students';

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setStudents(data);
        } catch (e) { console.error("Server Offline"); }
        setLoading(false);
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setFormData({ name: '', branch: '', year: '' });
        fetchStudents();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await fetch(`${API_URL}/${editingStudent.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingStudent)
        });
        setEditingStudent(null);
        fetchStudents();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Terminate this record?")) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchStudents();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans relative">
            {/* Ambient Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 blur-[130px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-cyan-600/10 blur-[130px] rounded-full"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div>
                        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-tighter italic">STUDENT NEXUS</h1>
                        <p className="text-slate-500 font-bold tracking-[0.2em] text-xs mt-2 uppercase">Fr. CRCE • Persistent Database v2.0</p>
                    </div>
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                        <span className="font-black text-xl text-cyan-400 tracking-widest">{students.length}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Enrollment Form */}
                    <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-800/50 shadow-2xl h-fit">
                        <h2 className="text-xl font-black mb-8 text-slate-100 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-cyan-500"></span> NEW ENTRY
                        </h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700"
                                placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            
                            {/* Hybrid Branch Input */}
                            <input list="branches" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                placeholder="Branch (Select or Type)" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} required />
                            <datalist id="branches">
                                <option value="Computer Science" /><option value="IT" /><option value="EXTC" /><option value="AI & ML" /><option value="Data Science" />
                            </datalist>

                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700"
                                placeholder="Year (e.g. SE)" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
                            
                            <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:scale-[1.02] text-white font-black py-5 rounded-2xl shadow-xl shadow-cyan-900/20 transition-all uppercase tracking-widest text-sm">
                                Register Student
                            </button>
                        </form>
                    </div>

                    {/* Records Table */}
                    <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-slate-800/50 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 border-b border-slate-800/50">
                                    <tr>
                                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Stream</th>
                                        <th className="p-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="p-20 text-center text-cyan-500 animate-pulse font-black italic">SYNCING DATABASE...</td></tr>
                                    ) : students.map((s) => (
                                        <tr key={s.id} className="border-b border-slate-800/30 hover:bg-white/5 transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-5">
                                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`} alt="avatar" className="w-12 h-12 rounded-2xl bg-slate-800 p-2 border border-slate-700" />
                                                    <div>
                                                        <div className="font-black text-slate-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{s.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase">{s.year} • ID: {String(s.id).slice(-5)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest">
                                                    {s.branch}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right space-x-6">
                                                <button onClick={() => setEditingStudent(s)} className="text-xs font-black text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest underline decoration-cyan-500/30 underline-offset-8">Edit</button>
                                                <button onClick={() => handleDelete(s.id)} className="text-xs font-black text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest italic">Del</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- THE UPDATE MODAL --- */}
            {editingStudent && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
                    <div className="bg-slate-900 border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black mb-8 text-cyan-400 italic uppercase tracking-tighter">Modify Log</h2>
                        <form onSubmit={handleUpdate} className="space-y-5">
                            <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-cyan-500"
                                value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} />
                            
                            <input list="modal-branches" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-cyan-500"
                                value={editingStudent.branch} onChange={e => setEditingStudent({...editingStudent, branch: e.target.value})} />
                            <datalist id="modal-branches">
                                <option value="Computer Science" /><option value="IT" /><option value="EXTC" />
                            </datalist>

                            <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-cyan-500"
                                value={editingStudent.year} onChange={e => setEditingStudent({...editingStudent, year: e.target.value})} />
                            
                            <div className="flex gap-4 mt-10">
                                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs">Save</button>
                                <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 bg-slate-800 text-slate-400 font-black py-4 rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;