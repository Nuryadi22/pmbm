import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import backgroundImage from '../assets/bg.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ no_registrasi: '', nik: '' });
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState([]);
  const [schoolYear, setSchoolYear] = useState('');
  const [checkStatusStartDate, setCheckStatusStartDate] = useState(null);
  const [checkStatusEndDate, setCheckStatusEndDate] = useState(null);

  useEffect(() => {
    document.title = 'PMBM MI Cikembulan | Penerimaan Murid Baru Madrasah';
    api.get('/pendaftaran/cek-status')
      .then(res => {
        setSchoolYear(res.data.schoolYear || '');
      })
      .catch(err => console.error(err));

    api.get('/admin/settings')
      .then(res => {
        if (res.data) {
          setCheckStatusStartDate(res.data.checkStatusStartDate || null);
          setCheckStatusEndDate(res.data.checkStatusEndDate || null);
          
          if (res.data.jadwal) {
            let rawJadwal = res.data.jadwal;
            // Handle case where MySQL/Sequelize might return JSON as string
            if (typeof rawJadwal === 'string') {
              try {
                rawJadwal = JSON.parse(rawJadwal);
              } catch (e) {
                rawJadwal = [];
              }
            }
            if (Array.isArray(rawJadwal)) {
              setJadwal(rawJadwal);
            }
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const isCheckStatusActive = () => {
    if (!checkStatusStartDate && !checkStatusEndDate) return true;
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (checkStatusStartDate && todayStr < checkStatusStartDate) {
      return false;
    }
    if (checkStatusEndDate && todayStr > checkStatusEndDate) {
      return false;
    }
    return true;
  };

  const handleCheckStatus = async (e) => {
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

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-4 border-[#004085] px-8 py-4 shadow-sm flex items-center sticky top-0 z-50">
        <img 
          src="src/assets/logo.png" 
          alt="Logo MI Cikembulan" 
          className="h-16 md:h-20 object-contain"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/200x80.png?text=Logo+MI+Cikembulan";
          }}
        />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        {/* Left Column - Jadwal & Alur */}
        <div className="flex-1 w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl text-gray-700 font-light mb-2">Jadwal Penerimaan Murid Baru Madrasah</h1>
            <h2 className="text-xl md:text-2xl text-gray-500 font-light">MI Cikembulan</h2>
          </div>

          {/* Jadwal Pendaftaran */}
          <div className="overflow-x-auto shadow-2xl rounded-2xl mb-10 border border-white/20">
            {jadwal.length > 0 ? (
              <table className="w-full text-center border-collapse bg-white/90 backdrop-blur-sm">
                <thead>
                  <tr className="bg-[#004085] text-white text-sm">
                    <th className="py-4 px-2 font-medium border border-[#002752] align-middle" rowSpan="2">Tahun Ajaran</th>
                    <th className="py-4 px-2 font-medium border border-[#002752] align-middle" rowSpan="2">Gelombang</th>
                    <th className="py-2 px-2 font-medium border border-[#002752]" colSpan="2">Pendaftaran</th>
                    <th className="py-4 px-2 font-medium border border-[#002752] align-middle" rowSpan="2">Tanggal Pengumuman</th>
                    <th className="py-4 px-2 font-medium border border-[#002752] align-middle" rowSpan="2">Masuk Sekolah</th>
                  </tr>
                  <tr className="bg-[#004085] text-white text-sm">
                    <th className="py-2 px-2 font-medium border border-[#002752]">Dibuka</th>
                    <th className="py-2 px-2 font-medium border border-[#002752]">Ditutup</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  {jadwal.map((item, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'hover:bg-blue-50/50' : 'bg-gray-50/50 hover:bg-blue-50/50'} transition`}>
                      <td className="py-4 px-2 border border-gray-200/50">{schoolYear || '-'}</td>
                      <td className="py-4 px-2 border border-gray-200/50">{item.gelombang || '-'}</td>
                      <td className="py-4 px-2 border border-gray-200/50">
                        {item.dibuka ? new Date(item.dibuka).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="py-4 px-2 border border-gray-200/50">
                        {item.ditutup ? new Date(item.ditutup).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="py-4 px-2 border border-gray-200/50">
                        {item.pengumuman ? new Date(item.pengumuman).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="py-4 px-2 border border-gray-200/50">
                        {item.mulaiKegiatan ? new Date(item.mulaiKegiatan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm p-8 text-center text-gray-400 text-sm">
                Jadwal belum tersedia. Silakan hubungi pihak sekolah.
              </div>
            )}
          </div>

          {/* Alur Pendaftaran */}
          <div>
            <h3 className="text-xl md:text-2xl text-gray-700 font-light mb-6 text-center border-b pb-2">Alur Pendaftaran</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm p-5 border-l-8 border-[#007bff] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h4 className="font-bold text-xl text-[#004085] mb-2">1. Isi Formulir</h4>
              <p className="text-sm text-gray-600">Klik tombol DAFTAR SEKARANG dan lengkapi data diri secara online dengan benar.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-5 border-l-8 border-[#007bff] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h4 className="font-bold text-xl text-[#004085] mb-2">2. Upload Berkas</h4>
              <p className="text-sm text-gray-600">Unggah scan Kartu Keluarga (KK), Akta Kelahiran, dan Pas Foto terbaru.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-5 border-l-8 border-[#007bff] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h4 className="font-bold text-xl text-[#004085] mb-2">3. Pantau Status</h4>
              <p className="text-sm text-gray-600">Gunakan Nomor Registrasi dan NIK untuk login dan cek status kelulusan secara berkala.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-5 border-l-8 border-[#007bff] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h4 className="font-bold text-xl text-[#004085] mb-2">4. Daftar Ulang</h4>
              <p className="text-sm text-gray-600">Bagi yang dinyatakan lolos, silakan lakukan daftar ulang sesuai jadwal yang ditentukan.</p>
            </div>
          </div>
          </div>
        </div>

        {/* Right Column - Status / Login Box */}
        <div className="w-full lg:w-[400px] flex-shrink-0 animate-fadeIn">
          
          <div className="bg-white/95 backdrop-blur-md border border-white/20 sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-3xl font-light text-gray-800 mb-2">Selamat Datang</h2>
            <p className="text-sm text-gray-500 mb-6">Silakan cek status untuk melihat hasil pendaftaran</p>

            {!isCheckStatusActive() ? (
              <div className="text-center py-4 animate-fadeIn">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <FaHourglassHalf className="text-2xl text-amber-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Menu Cek Status Ditutup</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Mohon maaf, menu cek status pendaftaran saat ini belum dibuka atau sudah ditutup sesuai jadwal akses.
                </p>
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 text-left space-y-1.5 shadow-sm">
                  <span className="block font-bold text-amber-900 border-b border-amber-100 pb-1 mb-1">Jadwal Akses Pengumuman:</span>
                  {checkStatusStartDate && (
                    <span className="block flex justify-between">
                      <span>Dibuka:</span>
                      <span className="font-semibold">{new Date(checkStatusStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                  )}
                  {checkStatusEndDate && (
                    <span className="block flex justify-between">
                      <span>Ditutup:</span>
                      <span className="font-semibold">{new Date(checkStatusEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                  )}
                </div>
              </div>
            ) : statusData ? (
              <div className="text-center animate-fadeIn py-4">
                {statusData.status === 'Lolos' ? <FaCheckCircle className="text-6xl text-success mx-auto mb-4" /> : 
                 statusData.status === 'Gagal' ? <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" /> : 
                 <FaHourglassHalf className="text-6xl text-yellow-500 mx-auto mb-4" />}
                
                <h2 className="text-xl font-bold text-dark mb-1">{statusData.nama_lengkap}</h2>
                <p className="text-gray-500 text-sm mb-4">No. Reg: {statusData.no_registrasi}</p>
                
                <div className="bg-gray-100 rounded-lg p-3 inline-block shadow-sm w-full mb-4">
                  <span className="block text-xs text-gray-500 mb-1">Status Saat Ini:</span>
                  <span className={`text-lg font-bold uppercase tracking-wider
                    ${statusData.status === 'Lolos' ? 'text-success' : 
                      statusData.status === 'Gagal' ? 'text-red-500' : 
                      'text-yellow-600'}
                  `}>
                    {statusData.status}
                  </span>
                </div>
                
                <button 
                  onClick={() => setStatusData(null)}
                  className="text-sm text-gray-500 hover:text-primary transition"
                >
                  Kembali Cek Status Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckStatus} className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Nomor Registrasi</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.no_registrasi}
                    onChange={e => setFormData({ ...formData, no_registrasi: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-50/30 border border-[#007bff]/50 rounded focus:outline-none focus:ring-1 focus:ring-[#007bff] focus:border-[#007bff] transition text-sm text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">NIK (Sebagai Kata Sandi)</label>
                  <input 
                    type="password" 
                    required 
                    maxLength="16"
                    value={formData.nik}
                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-50/30 border border-[#007bff]/50 rounded focus:outline-none focus:ring-1 focus:ring-[#007bff] focus:border-[#007bff] transition text-sm text-gray-700 placeholder-gray-400"
                  />
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="h-4 w-4 text-[#007bff] focus:ring-[#007bff] border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-xs text-gray-600">
                    Ingat saya
                  </label>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-medium py-2.5 rounded transition text-sm shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Cek Status'}
                </button>
                
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-700 mb-4 font-medium">Belum punya Nomor Registrasi?</p>
              <Link 
                to="/daftar" 
                className="block w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-medium py-2.5 rounded transition shadow-sm text-sm"
              >
                DAFTAR SEKARANG
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-gray-500 mt-auto">
        &copy; {new Date().getFullYear()} Penerimaan Murid Baru Madrasah <b>MI Cikembulan</b>. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
