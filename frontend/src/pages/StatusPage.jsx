import React, { useState } from 'react';
import api from '../utils/api';
import { FaSearch, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StatusPage = () => {
  const [formData, setFormData] = useState({ no_registrasi: '', nik: '' });
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusData(null);
    setLoading(true);

    try {
      const res = await api.get(`/pendaftaran/status/${formData.no_registrasi}?nik=${formData.nik}`);
      setStatusData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'Lolos') return <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />;
    if (status === 'Gagal') return <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />;
    return <FaHourglassHalf className="text-6xl text-yellow-500 mx-auto mb-4" />;
  };

  return (
    <div className="flex-grow flex flex-col items-center py-12 px-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-primary hover:text-teal-700 font-semibold mb-6 transition">
          <FaArrowLeft className="mr-2" /> Kembali ke Beranda
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold text-dark text-center mb-6">Cek Status Pendaftaran</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Registrasi</label>
              <input 
                type="text" 
                required 
                placeholder="PMBM-2026-XXXX"
                value={formData.no_registrasi}
                onChange={e => setFormData({ ...formData, no_registrasi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 Digit)</label>
              <input 
                type="text" 
                required 
                maxLength="16"
                placeholder="Masukkan NIK Siswa"
                value={formData.nik}
                onChange={e => setFormData({ ...formData, nik: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-md transition transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Mencari...' : 'Cek Status'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          {statusData && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center animate-fadeIn">
              <StatusIcon status={statusData.status} />
              <h2 className="text-xl font-bold text-dark mb-1">{statusData.nama_lengkap}</h2>
              <p className="text-gray-500 text-sm mb-4">No. Reg: {statusData.no_registrasi}</p>
              
              <div className="bg-gray-50 rounded-xl p-4 inline-block shadow-sm">
                <span className="block text-sm text-gray-500 mb-1">Status Saat Ini:</span>
                <span className={`text-xl font-bold uppercase tracking-wider
                  ${statusData.status === 'Lolos' ? 'text-green-600' : 
                    statusData.status === 'Gagal' ? 'text-red-600' : 
                    'text-yellow-600'}
                `}>
                  {statusData.status}
                </span>
              </div>
              
              {statusData.status === 'Lolos' && (
                <p className="mt-6 text-sm text-gray-600">
                  Selamat! Anda lolos seleksi. Silakan cek WhatsApp Anda untuk informasi daftar ulang.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
