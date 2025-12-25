import React, {useState, useEffect, useContext} from 'react';
import api from '../api/axiosConfig'; // Merkezi API ayarı
import {AuthContext} from '../context/AuthContext'; // Kullanıcı bilgisi
import {useNavigate} from 'react-router-dom';
import {LogOut, User, MapPin, Activity} from 'lucide-react'; // İkonlar

const VictimDashboard = () => {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    // State Tanımları
    const [needs, setNeeds] = useState([]);
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(1); // Varsayılan: Gıda

    // 1. Verileri Çekme Fonksiyonu
    const fetchNeeds = async () => {
        try {
            const response = await api.get('/needs');
            setNeeds(response.data);
        } catch (error) {
            console.error("Talepler çekilemedi:", error);
        }
    };

    // Sayfa açılınca verileri çek
    useEffect(() => {
        fetchNeeds();
    }, []);

    // 2. Talep Gönderme Fonksiyonu
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/needs', {
                description,
                categoryId: Number(categoryId), // Sayıya çeviriyoruz
                latitude: 37.7749, // Örnek koordinat (istersen GPS'ten alabiliriz)
                longitude: -122.4194,
            });
            alert('Talep başarıyla oluşturuldu!');
            setDescription(''); // Formu temizle
            fetchNeeds(); // Listeyi güncelle
        } catch (error) {
            console.error("Talep hatası:", error);
            alert('Talep oluşturulurken hata oluştu.');
        }
    };

    // 3. Güvenli Çıkış Fonksiyonu
    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* --- ÜST MENÜ (HEADER) --- */}
            <nav
                className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 p-2 rounded-full text-blue-500">
                        <Activity size={24}/>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            QuakeSense
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <User size={12}/>
                            <span>{user?.email || 'Afetzede'}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg transition text-sm font-bold"
                >
                    <LogOut size={16}/>
                    ÇIKIŞ
                </button>
            </nav>

            <div className="max-w-4xl mx-auto p-6 space-y-8">

                {/* --- TALEP OLUŞTURMA FORMU --- */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <MapPin className="text-blue-500"/>
                        Yardım Talebi Oluştur
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">İhtiyaç Kategorisi</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
                            >
                                <option value={1}>Gıda</option>
                                <option value={2}>Barınma</option>
                                <option value={3}>Lojistik</option>
                                <option value={4}>Sağlık</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Durum Açıklaması</label>
                            <textarea
                                placeholder="Örn: 3 kişi enkaz altındayız, acil su ve battaniye lazım..."
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

                {/* --- AKTİF TALEPLER LİSTESİ --- */}
                <div>
                    <h3 className="text-xl font-bold text-slate-400 mb-4 px-2">
                        Aktif Taleplerim ({needs.length})
                    </h3>

                    {needs.length === 0 ? (
                        <div
                            className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-500">Henüz bir yardım talebi oluşturmadınız.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {needs.map((need) => (
                                <div key={need.id}
                                     className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-start hover:border-slate-700 transition">
                                    <div>
                                        <span
                                            className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full mb-2">
                                            Kategori: {need.category?.name || 'Genel'}
                                        </span>
                                        <p className="text-slate-300 mt-1">{need.description}</p>
                                        <p className="text-xs text-slate-500 mt-3">
                                            {new Date(need.createdAt).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                    <div
                                        className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-xs font-bold">
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