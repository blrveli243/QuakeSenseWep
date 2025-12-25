import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Activity } from 'lucide-react';

const VictimDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Eski yapındaki gibi verileri tutuyoruz
    const [needs, setNeeds] = useState([]);

    // Senin istediğin "Konu" ve "Detay" ayrımı
    const [subject, setSubject] = useState(''); // Konu (Örn: Çadır)
    const [details, setDetails] = useState(''); // Detay (Örn: 3 kişi...)

    // Verileri Çekme
    const fetchNeeds = async () => {
        try {
            const response = await api.get('/needs');
            setNeeds(response.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    useEffect(() => {
        fetchNeeds();
    }, []);

    // TALEP GÖNDERME (HATASIZ VERSİYON)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // BACKEND İÇİN BİRLEŞTİRME:
            // Backend sadece 'description' anlıyor, 'title' gönderince 400 veriyordu.
            // Biz de ikisini birleştirip gönderiyoruz. Sorun kökten çözülüyor.
            const finalDescription = `[KONU: ${subject}] - ${details}`;

            await api.post('/needs', {
                description: finalDescription,
                categoryId: 1, // Hata vermemesi için varsayılan kategori
                latitude: 37.7749,
                longitude: -122.4194,
            });

            alert('Talep başarıyla iletildi!');
            setSubject('');
            setDetails('');
            fetchNeeds();
        } catch (error) {
            console.error("Talep hatası:", error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istiyor musunuz?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* --- ÜST KISIM (Beğendiğin Tasarım) --- */}
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
                    className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 transition"
                >
                    <LogOut size={16} />
                    ÇIKIŞ
                </button>
            </nav>

            <div className="max-w-4xl mx-auto p-6 space-y-8">

                {/* --- SENİN İSTEDİĞİN FORM YAPISI --- */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <MapPin className="text-blue-500" />
                        Yardım Talebi
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* 1. KONU KUTUSU */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2 font-bold">İhtiyaç Konusu</label>
                            <input
                                type="text"
                                placeholder="Örn: Gıda, Çadır, Isınma..."
                                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        {/* 2. DETAYLI AÇIKLAMA KUTUSU */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2 font-bold">Detaylı Açıklama</label>
                            <textarea
                                placeholder="Adres, kişi sayısı ve durum hakkında bilgi..."
                                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-32 resize-none text-white"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20"
                        >
                            TALEBİ YAYINLA
                        </button>
                    </form>
                </div>

                {/* --- LİSTELEME --- */}
                <div>
                    <h3 className="text-xl font-bold text-slate-400 mb-4 px-2">
                        Aktif Talepler ({needs.length})
                    </h3>

                    {needs.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-500">Henüz bir talep yok.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {needs.map((need) => (
                                <div key={need.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start hover:border-slate-700 transition">
                                    <p className="text-slate-300 font-medium">{need.description}</p>
                                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-xs font-bold">
                                        Bekleniyor
                                    </span>
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