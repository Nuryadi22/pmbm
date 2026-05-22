import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaSave, FaGlobe, FaWhatsapp, FaKey, FaToggleOn, FaToggleOff, FaCheck, FaTimes, FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // State for General Settings
  const [schoolYear, setSchoolYear] = useState('2026/2027');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [maxQuota, setMaxQuota] = useState('100');
  const [checkStatusStartDate, setCheckStatusStartDate] = useState('');
  const [checkStatusEndDate, setCheckStatusEndDate] = useState('');

  // State for API Settings
  const [fonnteToken, setFonnteToken] = useState('8b@t#2K9vXyZ!pL5mNqR');
  const [whatsappAdmin, setWhatsappAdmin] = useState('081234567890');
  const [welcomeMessage, setWelcomeMessage] = useState('Halo {nama}, pendaftaran PMBM Anda dengan No. Reg *{no_reg}* berhasil diterima. Silakan pantau pengumuman secara berkala.');
  const [statusMessageLolos, setStatusMessageLolos] = useState('Selamat {nama}! 🎉 Anda dinyatakan *DITERIMA* di MI Cikembulan. Silakan datang ke sekolah untuk proses selanjutnya.');
  const [statusMessageGagal, setStatusMessageGagal] = useState('Halo {nama}, mohon maaf pendaftaran Anda di MI Cikembulan *TIDAK DITERIMA*. Terima kasih telah mendaftar, semoga sukses di tempat lain.');

  // State for Jadwal
  const [jadwal, setJadwal] = useState([
    { gelombang: 'Gelombang 1', dibuka: '', ditutup: '', mulaiKegiatan: '', pengumuman: '' },
    { gelombang: 'Gelombang 2', dibuka: '', ditutup: '', mulaiKegiatan: '', pengumuman: '' }
  ]);

  // State for Security Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data) {
        setSchoolYear(res.data.schoolYear || '2026/2027');
        setRegistrationOpen(res.data.registrationOpen !== false);
        setMaxQuota(res.data.maxQuota || '100');
        setFonnteToken(res.data.fonnteToken || '');
        setWhatsappAdmin(res.data.whatsappAdmin || '');
        setWelcomeMessage(res.data.welcomeMessage || 'Halo {nama}, pendaftaran PPDB Anda dengan No. Reg *{no_reg}* berhasil diterima. Silakan pantau pengumuman secara berkala.');
        setStatusMessageLolos(res.data.statusMessageLolos || 'Selamat {nama}! 🎉 Anda dinyatakan *DITERIMA* di MI Cikembulan. Silakan datang ke sekolah untuk proses selanjutnya.');
        setStatusMessageGagal(res.data.statusMessageGagal || 'Halo {nama}, mohon maaf pendaftaran Anda di MI Cikembulan *TIDAK DITERIMA*. Terima kasih telah mendaftar, semoga sukses di tempat lain.');
        setCheckStatusStartDate(res.data.checkStatusStartDate || '');
        setCheckStatusEndDate(res.data.checkStatusEndDate || '');
        if (res.data.jadwal) {
          let rawJadwal = res.data.jadwal;
          if (typeof rawJadwal === 'string') {
            try {
              rawJadwal = JSON.parse(rawJadwal);
            } catch (e) {
              console.error("Failed to parse jadwal:", e);
              rawJadwal = [];
            }
          }
          if (Array.isArray(rawJadwal)) {
            setJadwal(rawJadwal);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', {
        schoolYear, 
        registrationOpen, 
        maxQuota, 
        fonnteToken, 
        whatsappAdmin, 
        welcomeMessage, 
        statusMessageLolos,
        statusMessageGagal,
        checkStatusStartDate: checkStatusStartDate || null,
        checkStatusEndDate: checkStatusEndDate || null,
        jadwal
      });
      showToast('Pengaturan berhasil disimpan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan pengaturan', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 pb-20">
      <h2 className="text-2xl font-bold text-[#004085] mb-6 border-b pb-4">Pengaturan Sistem</h2>

      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
        
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 flex-shrink-0">
          <ul className="flex md:flex-col p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
            <li>
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition text-sm font-medium whitespace-nowrap ${activeTab === 'general' ? 'bg-[#007bff] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaGlobe className={`mr-3 ${activeTab === 'general' ? 'text-blue-200' : 'text-gray-400'}`} /> Umum & PMBM
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('api')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition text-sm font-medium whitespace-nowrap ${activeTab === 'api' ? 'bg-[#007bff] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaWhatsapp className={`mr-3 ${activeTab === 'api' ? 'text-blue-200' : 'text-gray-400'}`} /> Notifikasi WA
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition text-sm font-medium whitespace-nowrap ${activeTab === 'security' ? 'bg-[#007bff] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaKey className={`mr-3 ${activeTab === 'security' ? 'text-blue-200' : 'text-gray-400'}`} /> Keamanan
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('jadwal')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition text-sm font-medium whitespace-nowrap ${activeTab === 'jadwal' ? 'bg-[#007bff] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaCalendarAlt className={`mr-3 ${activeTab === 'jadwal' ? 'text-blue-200' : 'text-gray-400'}`} /> Jadwal PMBM
              </button>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          <form onSubmit={handleSave}>
            
            {/* Tab: General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Pengaturan Umum & PMBM</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-800">Status Pendaftaran (PMBM)</h4>
                    <p className="text-sm text-gray-500">Buka atau tutup akses formulir pendaftaran untuk publik.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setRegistrationOpen(!registrationOpen)}
                    className="text-4xl focus:outline-none"
                  >
                    {registrationOpen ? <FaToggleOn className="text-green-500" /> : <FaToggleOff className="text-gray-400" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
                    <input 
                      type="text" 
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kuota Pendaftar</label>
                    <input 
                      type="number" 
                      value={maxQuota}
                      onChange={(e) => setMaxQuota(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                </div>

                <hr className="my-6 border-gray-100" />
                <h4 className="font-bold text-gray-800 mb-1">Jadwal Akses Cek Status Pendaftaran</h4>
                <p className="text-xs text-gray-500 mb-4">Batasi rentang tanggal kapan publik/pendaftar dapat melihat menu "Cek Status" di halaman utama. Kosongkan jika ingin terus dibuka.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai Dibuka</label>
                    <input 
                      type="date" 
                      value={checkStatusStartDate}
                      onChange={(e) => setCheckStatusStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai Ditutup</label>
                    <input 
                      type="date" 
                      value={checkStatusEndDate}
                      onChange={(e) => setCheckStatusEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Jadwal PMBM */}
            {activeTab === 'jadwal' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Jadwal Penerimaan Murid Baru Madrasah</h3>
                <p className="text-sm text-gray-500 bg-amber-50 p-4 rounded-xl border border-amber-100 mb-6">
                  Atur jadwal gelombang penerimaan murid baru madrasah. Jadwal ini akan ditampilkan di halaman publik untuk informasi calon pendaftar.
                </p>

                <div className="space-y-4">
                  {jadwal.map((item, index) => (
                    <div key={index} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#004085] flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-400" /> {item.gelombang || `Gelombang ${index + 1}`}
                        </span>
                        {jadwal.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setJadwal(jadwal.filter((_, i) => i !== index))}
                            className="text-red-400 hover:text-red-600 transition p-1"
                            title="Hapus gelombang"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nama Gelombang</label>
                        <input 
                          type="text" 
                          value={item.gelombang}
                          onChange={(e) => { const updated = [...jadwal]; updated[index].gelombang = e.target.value; setJadwal(updated); }}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition text-sm"
                          placeholder="Contoh: Gelombang 1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-green-600 mb-1">Pendaftaran Dibuka</label>
                          <input 
                            type="date" 
                            value={item.dibuka}
                            onChange={(e) => { const updated = [...jadwal]; updated[index].dibuka = e.target.value; setJadwal(updated); }}
                            className="w-full px-4 py-2.5 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 outline-none transition text-sm bg-green-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-red-600 mb-1">Pendaftaran Ditutup</label>
                          <input 
                            type="date" 
                            value={item.ditutup}
                            onChange={(e) => { const updated = [...jadwal]; updated[index].ditutup = e.target.value; setJadwal(updated); }}
                            className="w-full px-4 py-2.5 rounded-xl border border-red-300 focus:ring-2 focus:ring-red-500 outline-none transition text-sm bg-red-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-purple-600 mb-1">Tanggal Pengumuman</label>
                          <input 
                            type="date" 
                            value={item.pengumuman || ''}
                            onChange={(e) => { const updated = [...jadwal]; updated[index].pengumuman = e.target.value; setJadwal(updated); }}
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none transition text-sm bg-purple-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-600 mb-1">Masuk Sekolah</label>
                          <input 
                            type="date" 
                            value={item.mulaiKegiatan}
                            onChange={(e) => { const updated = [...jadwal]; updated[index].mulaiKegiatan = e.target.value; setJadwal(updated); }}
                            className="w-full px-4 py-2.5 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm bg-blue-50/50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  type="button" 
                  onClick={() => setJadwal([...jadwal, { gelombang: `Gelombang ${jadwal.length + 1}`, dibuka: '', ditutup: '', mulaiKegiatan: '', pengumuman: '' }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#007bff] hover:text-[#007bff] transition flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <FaPlus /> Tambah Gelombang
                </button>
              </div>
            )}

            {/* Tab: API Settings */}
            {activeTab === 'api' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Integrasi WhatsApp (Fonnte)</h3>
                <p className="text-sm text-gray-500 bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                  Pengaturan ini digunakan untuk mengirimkan notifikasi otomatis ke nomor WhatsApp pendaftar saat mereka mendaftar atau saat status mereka berubah.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Token API Fonnte</label>
                    <input 
                      type="password" 
                      value={fonnteToken}
                      onChange={(e) => setFonnteToken(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition font-mono"
                    />
                    <p className="text-xs text-gray-400 mt-2">Dapatkan token ini dari dashboard akun Fonnte Anda.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WA Admin (Penerima Laporan)</label>
                    <input 
                      type="text" 
                      value={whatsappAdmin}
                      onChange={(e) => setWhatsappAdmin(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  <hr className="my-6 border-gray-100" />
                  <h4 className="font-bold text-gray-800 mb-2">Template Pesan Otomatis (Chatbot)</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesan Pendaftaran Baru</label>
                    <textarea 
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">Gunakan <code>{'{nama}'}</code> untuk nama siswa dan <code>{'{no_reg}'}</code> untuk nomor registrasi.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">✅ Pesan Status Diterima (Lolos)</label>
                    <textarea 
                      value={statusMessageLolos}
                      onChange={(e) => setStatusMessageLolos(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 outline-none transition bg-green-50/50"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">Gunakan <code>{'{nama}'}</code> untuk nama siswa. Pesan ini dikirim saat pendaftar <strong>diterima</strong>.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">❌ Pesan Status Ditolak (Gagal)</label>
                    <textarea 
                      value={statusMessageGagal}
                      onChange={(e) => setStatusMessageGagal(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-red-300 focus:ring-2 focus:ring-red-500 outline-none transition bg-red-50/50"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">Gunakan <code>{'{nama}'}</code> untuk nama siswa. Pesan ini dikirim saat pendaftar <strong>ditolak</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Ubah Kata Sandi</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-[#004085] hover:bg-[#002752] text-white font-bold py-3 px-8 rounded-xl shadow-md transition flex items-center">
                <FaSave className="mr-2" /> Simpan Pengaturan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[60] animate-fadeIn ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <FaCheck /> : <FaTimes />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
