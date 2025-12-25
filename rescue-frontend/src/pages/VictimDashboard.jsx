import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig'; // Merkezi axios ayarı
import { AuthContext } from '../context/AuthContext'; // Kullanıcı bilgileri
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Activity } from 'lucide-react';

const VictimDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State Tanımları
    const [needs, setNeeds] = useState([]);
    const [subject, setSubject] = useState(''); // Formdaki "Konu" alanı
    const [details, setDetails] = useState(''); // Formdaki "Detay" alanı

    // 1. Talepleri Sunucudan Çekme
    const fetchNeeds = async () => {
        try {
            const response = await api.get('/needs');
            setNeeds(response.data);
        } catch (error) {
            console.error("Talepler yüklenemedi:", error);
        }
    };

    useEffect(() => {
        fetchNeeds();
    }, []);

    // 2. Talep Yayınlama (Backend Entity ile Tam Uyumlu)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend Need Entity'sindeki title ve description alanlarını dolduruyoruz
            await api.post('/needs', {
                title: subject,       // Formdaki Konu -> Backend title
                description: details, // Formdaki Detay -> Backend description
                categoryId: 1,        // Kategori seçimi istemediğin için varsayılan 1 gönderiyoruz
                latitude: 37.7749,    // Konum bilgisi (geçici)
                longitude: -122.4194, // Konum bilgisi (geçici)
            });

            alert('Yardım talebiniz başarıyla yayınlandı!');
            setSubject('');
            setDetails('');
            fetchNeeds(); // Listeyi güncelle
        } catch (error) {
            console.error("Talep hatası:", error);
            alert('Talep gönderilemedi. Lütfen tüm alanları doldurduğunuzdan emin olun.');
        }
    };

    // 3. Güvenli Çıkış
    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* ÜST BAR: Kullanıcı Adı ve Çıkış Butonu */}
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
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg transition text-sm font-bold shadow-md"
                >
                    <LogOut size={16} />
                    ÇIKIŞ YAP
                </button>
            </nav>

            <div className="max-w-4xl mx-auto p-6 space-y-8">

                {/* YARDIM TALEBİ FORMU */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <MapPin className="text-blue-500" />
                        Acil Yardım Talebi
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">İhtiyaç Konusu</label>
                            <input
                                type="text"
                                placeholder="Örn: Gıda Yardımı, Enkaz Altında Ses"
                                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-white placeholder:text-slate-600"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">Detaylı Açıklama</label>
                            <textarea
                                placeholder="Lütfen adresinizi ve ihtiyacınızı detaylandırın..."
                                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-32 resize-none text-white placeholder:text-slate-600"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                        >
                            TALEBİ YAYINLA
                        </button>
                    </form>
                </div>

                {/* TALEPLERİM LİSTESİ */}
                <div>
                    <h3 className="text-xl font-bold text-slate-400 mb-4 px-2">
                        Aktif Taleplerim ({needs.length})
                    </h3>

                    {needs.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-500 italic">Henüz bir yardım talebiniz bulunmamaktadır.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {needs.map((need) => (
                                <div key={need.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col gap-3 hover:border-slate-700 transition shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-bold text-blue-400">
                                            {need.title}
                                        </h4>
                                        <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
                                            Bekleniyor
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{need.description}</p>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1 border-t border-slate-800 pt-3">
                                        <Activity size={10} />
                                        {new Date(need.createdAt || Date.now()).toLocaleString('tr-TR')}
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