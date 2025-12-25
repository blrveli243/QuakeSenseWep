import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            login(response.data);
            response.data.role === 'Volunteer' ? navigate('/volunteer') : navigate('/victim');
        } catch (error) {
            alert('Giriş başarısız!');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
            {/* Arka plan deseni için ayrı bir katman */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black tracking-tighter text-white">QuakeSense</h1>
                    <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">Koordinasyon Sistemi</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none ring-blue-500 transition focus:ring-2"
                            placeholder="E-posta adresi"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none ring-blue-500 transition focus:ring-2"
                            placeholder="Şifre"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95">
                        SİSTEME GİRİŞ YAP
                    </button>
                </form>

                <div className="mt-8 border-t border-white/5 pt-6 text-center">
                    <button onClick={() => navigate('/register')} className="text-sm text-slate-400 hover:text-white transition">
                        Hesabınız yok mu? <span className="font-bold text-blue-400">Hemen Kayıt Ol</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;