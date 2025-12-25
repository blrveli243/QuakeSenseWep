import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Activity } from 'lucide-react';

const VictimDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Sadece açıklama ve listeyi tutuyoruz
    const [needs, setNeeds] = useState([]);
    const [description, setDescription] = useState('');

    // 1. Verileri Çekme
    const fetchNeeds = async () => {
        try {
            const response = await api.get('/needs');
            setNeeds(response.data);
        } catch (error) {
            console.error("Talepler çekilemedi:", error);
        }
    };

    useEffect(() => {
        fetchNeeds();
    }, []);

    // 2. Talep Gönderme (Kategorisiz)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend'e sadece açıklama ve koordinat gönderiyoruz
            await api.post('/needs', {
                description,
                latitude: 37.7749, // Varsayılan konum (istersen silebilirsin)
                longitude: -122.4194,
            });
            alert('Talep başarıyla oluşturuldu!');
            setDescription(''); // Kutuyu temizle
            fetchNeeds(); // Listeyi yenile
        } catch (error) {
            console.error("Talep hatası:", error);
            alert('Talep gönderilemedi. (Sunucu hatası)');
        }
    };

    // 3. Çıkış İşlemi
    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* --- ÜST MENÜ --- */}
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 p-2 rounded-full text-blue-500">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            QuakeSense
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <User size={12} />
                            <span>{user?.email || 'Kullanıcı'}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg transition text-sm font-bold"
                >
                    <LogOut size={16} />
                    ÇIKIŞ
                </button>
            </nav>

            <div className="max-w-4xl mx-auto p-6 space-y-8">

                {/* --- FORM KISMI --- */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <MapPin className="text-blue-500" />
                        Yardım Talebi Oluştur
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Kategori Seçimi SİLİNDİ */}

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Durum Açıklaması</label>
                            <textarea
                                placeholder="Örn: Enkaz altındayız, acil su lazım..."
                                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-32 resize-none text-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20"
                        >
                            TALEP YAYINLA
                        </button>
                    </form>
                </div>

                {/* --- LİSTE KISMI --- */}
                <div>
                    <h3 className="text-xl font-bold text-slate-400 mb-4 px-2">
                        Aktif Taleplerim ({needs.length})
                    </h3>

                    {needs.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-500">Henüz talep oluşturmadınız.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {needs.map((need) => (
                                <div key={need.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start hover:border-slate-700 transition">
                                    <div>
                                        <p className="text-slate-300 font-medium text-lg">{need.description}</p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {new Date(need.createdAt).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-xs font-bold">
                                        Bekleniyor
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VictimDashboard;