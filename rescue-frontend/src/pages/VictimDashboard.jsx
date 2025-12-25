import React, {useState, useEffect, useContext} from 'react';
import api from '../api/axiosConfig';
import {AuthContext} from '../context/AuthContext';

const VictimDashboard = () => {
    const {user, logout} = useContext(AuthContext);
    const [need, setNeed] = useState({title: '', description: '', categoryId: 1});
    const [myNeeds, setMyNeeds] = useState([]);

    useEffect(() => {
        if (user?.id) fetchMyNeeds();
    }, [user]);

    const fetchMyNeeds = async () => {
        try {
            const response = await api.get('/needs');
            const filtered = response.data.filter(n => Number(n.userId || n.user?.id) === Number(user.id));
            setMyNeeds(filtered);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddNeed = async (e) => {
        e.preventDefault();
        try {
            // Gereksinim: Frontend üzerinden veritabanına veri ekleme [cite: 10]
            await api.post('/needs', {...need, userId: user.id});
            setNeed({title: '', description: '', categoryId: 1});
            fetchMyNeeds();
        } catch (err) {
            alert("Hata!");
        }
    };

    const handleDelete = async (id) => {
        // Gereksinim: Frontend üzerinden veri silme [cite: 11]
        if (window.confirm("Talebi silmek istediğine emin misin Veli?")) {
            await api.delete(`/needs/${id}`);
            fetchMyNeeds();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold border-l-4 border-blue-600 pl-4 text-blue-500">QuakeSense
                        Victim</h1>
                    <button onClick={logout}
                            className="text-red-500 border border-red-500/30 px-4 py-1 rounded-xl">Güvenli Çıkış
                    </button>
                </div>

                <form onSubmit={handleAddNeed}
                      className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                    <input className="w-full bg-slate-900 p-4 rounded-2xl" placeholder="İhtiyaç Başlığı"
                           value={need.title} onChange={e => setNeed({...need, title: e.target.value})} required/>
                    <textarea className="w-full bg-slate-900 p-4 rounded-2xl h-32" placeholder="Detaylar ve Konum..."
                              value={need.description} onChange={e => setNeed({...need, description: e.target.value})}
                              required/>
                    <button className="w-full bg-blue-600 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">TALEP
                        YAYINLA
                    </button>
                </form>

                <div className="grid gap-4">
                    <h3 className="text-xl font-semibold opacity-80">Aktif Taleplerim ({myNeeds.length})</h3>
                    {myNeeds.map(item => (
                        <div key={item.id}
                             className="bg-slate-900 p-6 rounded-3xl flex justify-between items-center group border border-white/5 hover:border-blue-500/20 transition">
                            <div>
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                <p className="text-sm text-slate-400">{item.description}</p>
                                <div className="mt-3">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${
                      item.status === 'Gönüllü Yolda' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' :
                          item.status === 'Yardım Edildi' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                  }`}>
                    {item.status || 'YAYINDA'}
                  </span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(item.id)}
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-all font-semibold">Sil
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default VictimDashboard;