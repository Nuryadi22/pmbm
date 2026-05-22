import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import * as XLSX from 'xlsx';
import { FaEye, FaCheck, FaTimes, FaSearch, FaFileExcel, FaTrash, FaWhatsapp } from 'react-icons/fa';

const AdminPendaftar = () => {
  const [pendaftar, setPendaftar] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [verifikasiModal, setVerifikasiModal] = useState({ show: false, id: null, status: '', catatan: '' });
  const [toast, setToast] = useState(null);

  // States untuk Broadcast WA
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Halo {nama},\n\nPengumuman hasil seleksi PMBM MI Cikembulan sudah dapat dicek secara online!\nSilakan cek status kelulusan Anda di website resmi kami menggunakan:\n• No. Registrasi: {no_reg}\n• Kata Sandi: NIK\n\nTerima kasih.'
  );
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchPendaftar();
  }, []);

  const fetchPendaftar = async () => {
    try {
      const res = await api.get('/admin/pendaftar');
      setPendaftar(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmVerifikasi = (id, status) => {
    setVerifikasiModal({ show: true, id, status, catatan: '' });
  };

  const submitVerifikasi = async () => {
    if (!verifikasiModal.id) return;
    const { id, status, catatan } = verifikasiModal;

    try {
      await api.patch(`/admin/pendaftar/${id}/verifikasi`, { status, catatan });
      showToast('Status berhasil diperbarui.', 'success');
      fetchPendaftar();
      setVerifikasiModal({ show: false, id: null, status: '', catatan: '' });
      if (showModal) setShowModal(false);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengubah status', 'error');
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      showToast('Pesan broadcast tidak boleh kosong', 'error');
      return;
    }

    setSendingBroadcast(true);
    try {
      await api.post('/admin/broadcast-pengumuman', { message: broadcastMessage });
      showToast('Broadcast berhasil dijalankan di latar belakang.', 'success');
      setShowBroadcastModal(false);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Gagal mengirim broadcast', 'error');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleView = async (id) => {
    setLoadingDetail(true);
    setShowModal(true);
    setSelectedDetail(null);
    try {
      const res = await api.get(`/admin/pendaftar/${id}`);
      setSelectedDetail(res.data);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengambil detail pendaftar', 'error');
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await api.delete(`/admin/pendaftar/${deleteModal.id}`);
      fetchPendaftar();
      setDeleteModal({ show: false, id: null });
      if (showModal) setShowModal(false);
      showToast('Data pendaftar berhasil dihapus', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus pendaftar', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Lolos: 'bg-green-100 text-green-800',
      Gagal: 'bg-red-100 text-red-800'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  const formatTTL = (tempat, tanggal) => {
    if (!tanggal) return tempat || '-';
    const date = new Date(tanggal);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
    return `${tempat}, ${formattedDate}`;
  };

  const filteredPendaftar = pendaftar.filter(p => p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || p.no_registrasi.toLowerCase().includes(search.toLowerCase()));

  const handleExport = () => {
    const exportData = filteredPendaftar.map((p, index) => ({
      'No': index + 1,
      'No Registrasi': p.no_registrasi,
      'NIK': p.nik,
      'Nama Lengkap': p.nama_lengkap,
      'TTL': formatTTL(p.tempat_lahir, p.tanggal_lahir),
      'Jenis Kelamin': p.jenis_kelamin,
      'Asal Sekolah': p.asal_sekolah,
      'Status': p.status,
      'Tanggal Daftar': new Date(p.tanggal_daftar).toLocaleDateString('id-ID')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar");
    XLSX.writeFile(workbook, `Data_Pendaftar_${new Date().getTime()}.xlsx`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-dark">Daftar Calon Siswa</h2>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Cari Nama / No. Reg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition shadow-md"
              title="Kirim Broadcast WA"
            >
              <FaWhatsapp className="text-lg" />
              <span className="text-sm font-semibold hidden sm:inline">Broadcast</span>
            </button>

            <button onClick={handleExport} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-md">
              <FaFileExcel />
              <span className="text-sm font-semibold hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">No. Reg</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Nama Lengkap</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Tempat, Tgl Lahir</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">L/P</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendaftar.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 text-sm font-medium text-dark">{p.no_registrasi}</td>
                  <td className="p-4 text-sm text-gray-700">{p.nama_lengkap}</td>
                  <td className="p-4 text-sm text-gray-700">{formatTTL(p.tempat_lahir, p.tanggal_lahir)}</td>
                  <td className="p-4 text-sm text-gray-700">{p.jenis_kelamin}</td>
                  <td className="p-4">{getStatusBadge(p.status)}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleView(p.id)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Lihat Detail">
                      <FaEye />
                    </button>
                    <button onClick={() => confirmDelete(p.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPendaftar.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 text-sm">Tidak ada data ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pendaftar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Detail Pendaftar</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingDetail ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#007bff]"></div>
                </div>
              ) : selectedDetail ? (
                <div className="space-y-6">
                  {/* Info Siswa */}
                  <div>
                    <h4 className="font-bold text-lg text-[#004085] border-b pb-2 mb-4">Data Siswa</h4>
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Pas Foto di Paling Atas/Kiri */}
                      {selectedDetail.dokumen?.foto_diri_url ? (
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <img src={selectedDetail.dokumen.foto_diri_url} alt="Foto" className="w-32 h-40 object-cover rounded-xl border-4 border-white shadow-md" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image"; }} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 mx-auto sm:mx-0 w-32 h-40 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          Tidak ada foto
                        </div>
                      )}

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500 block">No Registrasi</span> <span className="font-semibold text-gray-800">{selectedDetail.siswa.no_registrasi}</span></div>
                        <div><span className="text-gray-500 block">Status</span> {getStatusBadge(selectedDetail.siswa.status)}</div>
                        <div><span className="text-gray-500 block">NIK</span> <span className="font-semibold text-gray-800">{selectedDetail.siswa.nik}</span></div>
                        <div><span className="text-gray-500 block">Nama Lengkap</span> <span className="font-semibold text-gray-800">{selectedDetail.siswa.nama_lengkap}</span></div>
                        <div><span className="text-gray-500 block">Jenis Kelamin</span> <span className="font-semibold text-gray-800">{selectedDetail.siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
                        <div><span className="text-gray-500 block">TTL</span> <span className="font-semibold text-gray-800">{formatTTL(selectedDetail.siswa.tempat_lahir, selectedDetail.siswa.tanggal_lahir)}</span></div>
                        <div><span className="text-gray-500 block">Asal Sekolah</span> <span className="font-semibold text-gray-800">{selectedDetail.siswa.asal_sekolah || '-'}</span></div>
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block">Alamat Lengkap</span>
                          <span className="font-semibold text-gray-800">
                            {selectedDetail.siswa.alamat?.detail ? `${selectedDetail.siswa.alamat.detail}, RT ${selectedDetail.siswa.alamat.rt}/RW ${selectedDetail.siswa.alamat.rw}, ${selectedDetail.siswa.alamat.desa}, ${selectedDetail.siswa.alamat.kecamatan}, ${selectedDetail.siswa.alamat.kabupaten}, ${selectedDetail.siswa.alamat.provinsi}` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Orang Tua */}
                  {selectedDetail.orangTua && (
                    <div>
                      <h4 className="font-bold text-lg text-[#004085] border-b pb-2 mb-4">Data Orang Tua</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500 block">Nama Ayah</span> <span className="font-semibold text-gray-800">{selectedDetail.orangTua.ayah?.nama || '-'}</span></div>
                        <div><span className="text-gray-500 block">Nama Ibu</span> <span className="font-semibold text-gray-800">{selectedDetail.orangTua.ibu?.nama || '-'}</span></div>
                        <div><span className="text-gray-500 block">No. WhatsApp Utama</span> <span className="font-semibold text-gray-800">{selectedDetail.orangTua.no_wa_utama || '-'}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Info Dokumen */}
                  {selectedDetail.dokumen && (
                    <div>
                      <h4 className="font-bold text-lg text-[#004085] border-b pb-2 mb-4">Dokumen Pendukung</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedDetail.dokumen.kartu_keluarga_url && (
                          <div className="text-center p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                            <span className="text-xs text-gray-500 block mb-2">Kartu Keluarga</span>
                            <a href={selectedDetail.dokumen.kartu_keluarga_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">Lihat Berkas KK</a>
                          </div>
                        )}
                        {selectedDetail.dokumen.akta_kelahiran_url && (
                          <div className="text-center p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                            <span className="text-xs text-gray-500 block mb-2">Akta Kelahiran</span>
                            <a href={selectedDetail.dokumen.akta_kelahiran_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">Lihat Berkas Akta</a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Data tidak tersedia.</div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedDetail && (selectedDetail.siswa.status === 'Pending' || selectedDetail.siswa.status === 'Draft') && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end mt-auto">
                <button onClick={() => confirmVerifikasi(selectedDetail.siswa.id, 'Gagal')} className="px-6 py-2 bg-red-100 text-red-600 hover:bg-red-200 font-bold rounded-xl transition">
                  Ditolak
                </button>
                <button onClick={() => confirmVerifikasi(selectedDetail.siswa.id, 'Lolos')} className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl transition shadow-md">
                  Diterima
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Hapus Pendaftar */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Pendaftar?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteModal({ show: false, id: null })} className="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition w-full">
                Batal
              </button>
              <button onClick={handleDelete} className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl transition shadow-md w-full">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Verifikasi Pendaftar */}
      {verifikasiModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${verifikasiModal.status === 'Lolos' ? 'bg-green-100' : 'bg-red-100'}`}>
              {verifikasiModal.status === 'Lolos' ? <FaCheck className="text-2xl text-green-600" /> : <FaTimes className="text-2xl text-red-600" />}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Konfirmasi {verifikasiModal.status === 'Lolos' ? 'Diterima' : 'Ditolak'}
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              Anda akan memberikan status <strong className={verifikasiModal.status === 'Lolos' ? 'text-green-600' : 'text-red-600'}>{verifikasiModal.status === 'Lolos' ? 'Lolos' : 'Gagal'}</strong> pada pendaftar ini.
            </p>
            <div className="mb-6 text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Tambahan (Opsional)</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                rows="3"
                placeholder="Masukkan catatan jika ada..."
                value={verifikasiModal.catatan}
                onChange={(e) => setVerifikasiModal({ ...verifikasiModal, catatan: e.target.value })}
              ></textarea>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setVerifikasiModal({ show: false, id: null, status: '', catatan: '' })} className="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition flex-1">
                Batal
              </button>
              <button onClick={submitVerifikasi} className={`px-6 py-2.5 text-white font-bold rounded-xl transition shadow-md flex-1 ${verifikasiModal.status === 'Lolos' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Broadcast Pengumuman */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaWhatsapp className="text-green-500 text-2xl" /> Broadcast Pengumuman WA
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <p className="text-gray-500 mb-4 text-sm leading-relaxed text-left">
              Kirimkan pengumuman massal ke seluruh nomor WhatsApp utama orang tua pendaftar untuk menginformasikan bahwa hasil seleksi sudah dirilis.
            </p>

            <div className="mb-4 bg-blue-50 border border-blue-100 text-blue-800 text-xs p-3 rounded-xl text-left">
              <span className="font-bold block mb-1">Gunakan Placeholder Otomatis:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li><code>{"{nama}"}</code> &rarr; Nama lengkap calon siswa.</li>
                <li><code>{"{no_reg}"}</code> &rarr; Nomor registrasi calon siswa.</li>
              </ul>
            </div>

            <div className="mb-6 text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan Custom WhatsApp</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                rows="6"
                placeholder="Tulis pesan pengumuman..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBroadcastModal(false)}
                disabled={sendingBroadcast}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleSendBroadcast}
                disabled={sendingBroadcast}
                className="px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {sendingBroadcast ? 'Mengirim...' : 'Kirim Pengumuman'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[60] animate-fadeIn ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <FaCheck /> : <FaTimes />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}
    </>
  );
};

export default AdminPendaftar;
