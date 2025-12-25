import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const VolunteerDashboard = () => {
    const [needs, setNeeds] = useState([]);

    useEffect(() => { fetchNeeds(); }, []);

    const fetchNeeds = async () => {
        try {
            const response = await api.get('/needs');
            setNeeds(response.data);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/needs/${id}/status`, { status: newStatus });
            alert(`İşlem Başarılı: ${newStatus}`);
            fetchNeeds();
        } catch (err) { alert("Güncelleme başarısız."); }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-10 border-l-4 border-blue-600 pl-4">Gönüllü Takip Paneli</h1>
            <div className="grid gap-6">
                {needs.map((item) => (
                    <div key={item.id} className="bg-slate-900 p-8 rounded-3xl flex justify-between items-center border border-white/5">
                        <div>
                            <h2 className="text-xl font-bold">{item.title}</h2>
                            <p className="text-slate-400">{item.description}</p>
                            <div className="mt-3">
                <span className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 uppercase">
                  Durum: {item.status || 'Açık'}
                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {(!item.status || item.status === 'Açık') && (
                                <button onClick={() => updateStatus(item.id, 'Gönüllü Yolda')} className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-500">YARDIM ET</button>
                            )}
                            {item.status === 'Gönüllü Yolda' && (
                                <button onClick={() => updateStatus(item.id, 'Yardım Edildi')} className="bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-500">YARDIM ULAŞTI</button>
                            )}
                            {item.status === 'Yardım Edildi' && (
                                <span className="text-green-500 font-bold">✅ TAMAMLANDI</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default VolunteerDashboard;