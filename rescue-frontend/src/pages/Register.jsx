import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'Victim' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Backend'deki register endpoint'ine istek atıyoruz
            await axios.post('http://localhost:3000/auth/register', formData);
            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            navigate('/login');
        } catch (error) {
            alert('Kayıt sırasında bir hata oluştu.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black tracking-tighter text-white">QuakeSense</h1>
                    <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">Yeni Hesap Oluştur</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <input
                        type="email"
                        placeholder="E-posta adresi"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none ring-blue-500 transition focus:ring-2"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none ring-blue-500 transition focus:ring-2"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Rolünüzü Seçin</label>
                        <select
                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none ring-blue-500 transition focus:ring-2"
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="Victim">Afetzede</option>
                            <option value="Volunteer">Gönüllü</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95 uppercase">
                        Kayıt Ol
                    </button>
                </form>

                <div className="mt-8 border-t border-white/5 pt-6 text-center">
                    <button onClick={() => navigate('/login')} className="text-sm text-slate-400 hover:text-white transition">
                        Zaten hesabınız var mı? <span className="font-bold text-blue-400">Giriş Yap</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;