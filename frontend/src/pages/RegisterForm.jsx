import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaFileUpload, FaCheckCircle, FaTimesCircle, FaLock } from 'react-icons/fa';
import axios from 'axios';
import api from '../utils/api';
import backgroundImage from '../assets/bg.jpg';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });
  const [registeredNo, setRegisteredNo] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [schoolYear, setSchoolYear] = useState('');
  const [formData, setFormData] = useState({
    // Siswa
    nik: '',
    nama_lengkap: '',
    jenis_kelamin: 'L',
    tempat_lahir: '',
    tanggal_lahir: '',
    asal_sekolah: '',
    // Alamat
    provinsi: '',
    provinsi_name: '',
    kabupaten: '',
    kabupaten_name: '',
    kecamatan: '',
    kecamatan_name: '',
    desa: '',
    desa_name: '',
    rt: '',
    rw: '',
    alamat_detail: '',
    // Orang Tua
    nama_ayah: '',
    nama_ibu: '',
    no_wa_utama: '',
    // Berkas
    kk_file: null,
    akta_file: null,
    foto_file: null
  });

  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    // Cek apakah pendaftaran dibuka
    api.get('/pendaftaran/cek-status')
      .then(res => {
        if (res.data.registrationOpen === false) {
          setRegistrationClosed(true);
          setSchoolYear(res.data.schoolYear || '');
        }
      })
      .catch(err => console.error(err));

    axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => setProvinces(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleProvinsiChange = (e) => {
    const id = e.target.value;
    if(!id) {
      setFormData(prev => ({ ...prev, provinsi: '', provinsi_name: '', kabupaten: '', kabupaten_name: '', kecamatan: '', kecamatan_name: '', desa: '', desa_name: '' }));
      return;
    }
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, provinsi: id, provinsi_name: name, kabupaten: '', kabupaten_name: '', kecamatan: '', kecamatan_name: '', desa: '', desa_name: '' }));
    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`)
      .then(res => setRegencies(res.data))
      .catch(err => console.error(err));
  };

  const handleKabupatenChange = (e) => {
    const id = e.target.value;
    if(!id) {
      setFormData(prev => ({ ...prev, kabupaten: '', kabupaten_name: '', kecamatan: '', kecamatan_name: '', desa: '', desa_name: '' }));
      return;
    }
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, kabupaten: id, kabupaten_name: name, kecamatan: '', kecamatan_name: '', desa: '', desa_name: '' }));
    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`)
      .then(res => setDistricts(res.data))
      .catch(err => console.error(err));
  };

  const handleKecamatanChange = (e) => {
    const id = e.target.value;
    if(!id) {
      setFormData(prev => ({ ...prev, kecamatan: '', kecamatan_name: '', desa: '', desa_name: '' }));
      return;
    }
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, kecamatan: id, kecamatan_name: name, desa: '', desa_name: '' }));
    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${id}.json`)
      .then(res => setVillages(res.data))
      .catch(err => console.error(err));
  };

  const handleDesaChange = (e) => {
    const id = e.target.value;
    if(!id) {
      setFormData(prev => ({ ...prev, desa: '', desa_name: '' }));
      return;
    }
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, desa: id, desa_name: name }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Khusus untuk preview pas foto
      if (name === 'foto_file') {
        setFotoPreview(URL.createObjectURL(files[0]));
      }
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if(formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const res = await api.post('/pendaftaran', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRegisteredNo(res.data.no_registrasi);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat mengirim data.';
      setErrorModal({ show: true, message: errorMsg });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
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

      {/* Header (Same as Landing Page) */}
      <header className="bg-white/80 backdrop-blur-md border-b-4 border-[#004085] px-8 py-4 shadow-sm flex items-center sticky top-0 z-50">
        <img 
          src="src/assets/logo.png" 
          alt="Logo MI Cikembulan" 
          className="h-16 md:h-20 object-contain cursor-pointer"
          onClick={() => navigate('/')}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/200x80.png?text=Logo+MI+Cikembulan";
          }}
        />
      </header>

      <main className="flex-grow py-10 px-4 flex flex-col items-center">
        {/* Page Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl text-[#004085] font-bold mb-2 drop-shadow-sm">Formulir Pendaftaran Siswa Baru</h1>
          <h2 className="text-xl md:text-2xl text-gray-600 font-medium">MI Cikembulan</h2>
          <div className="w-24 h-1 bg-[#004085] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Modal Pendaftaran Ditutup */}
        {registrationClosed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <FaLock className="text-3xl text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Pendaftaran Ditutup</h2>
              <p className="text-gray-500 mb-2">Mohon maaf, penerimaan murid baru madrasah untuk</p>
              {schoolYear && (
                <p className="text-lg font-bold text-[#004085] mb-4">Tahun Ajaran {schoolYear}</p>
              )}
              <p className="text-gray-500 mb-8 text-sm">saat ini sedang <strong className="text-red-600">tidak dibuka</strong>. Silakan hubungi pihak sekolah atau pantau website ini untuk informasi lebih lanjut.</p>
              <button 
                onClick={() => navigate('/')} 
                className="w-full py-3 bg-[#004085] hover:bg-[#002752] text-white font-bold rounded-xl transition shadow-md"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-fadeIn">
          {/* Header Steps */}
          <div className="bg-[#004085] px-8 py-6 text-white flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#002752] -z-0 transform -translate-y-1/2 hidden md:block"></div>
            
            <div className={`z-10 flex flex-col items-center transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-white text-[#004085] shadow-lg' : 'bg-[#002752] text-white'}`}>
                <FaUser />
              </div>
              <span className="text-xs font-semibold hidden md:block">Data Siswa</span>
            </div>

            <div className={`z-10 flex flex-col items-center transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-white text-[#004085] shadow-lg' : 'bg-[#002752] text-white'}`}>
                <FaUsers />
              </div>
              <span className="text-xs font-semibold hidden md:block">Orang Tua</span>
            </div>

            <div className={`z-10 flex flex-col items-center transition-opacity ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-white text-[#004085] shadow-lg' : 'bg-[#002752] text-white'}`}>
                <FaFileUpload />
              </div>
              <span className="text-xs font-semibold hidden md:block">Berkas</span>
            </div>

            <div className={`z-10 flex flex-col items-center transition-opacity ${step >= 4 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= 4 ? 'bg-white text-[#004085] shadow-lg' : 'bg-[#002752] text-white'}`}>
                <FaCheckCircle />
              </div>
              <span className="text-xs font-semibold hidden md:block">Review</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Diri Siswa</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 Digit)</label>
                    <input type="text" name="nik" value={formData.nik} onChange={handleChange} required maxLength="16" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Masukkan 16 digit NIK" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Nama sesuai akta" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                      <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Kota/Kabupaten" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                      <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                      <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Asal Sekolah (TK/RA)</label>
                      <input type="text" name="asal_sekolah" value={formData.asal_sekolah} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Opsional" />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Alamat Lengkap</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                        <select required name="provinsi" value={formData.provinsi} onChange={handleProvinsiChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition">
                          <option value="">Pilih Provinsi</option>
                          {provinces.map(prov => <option key={prov.id} value={prov.id}>{prov.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten/Kota</label>
                        <select required name="kabupaten" value={formData.kabupaten} onChange={handleKabupatenChange} disabled={!formData.provinsi} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition disabled:bg-gray-100 disabled:text-gray-400">
                          <option value="">Pilih Kabupaten/Kota</option>
                          {regencies.map(reg => <option key={reg.id} value={reg.id}>{reg.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                        <select required name="kecamatan" value={formData.kecamatan} onChange={handleKecamatanChange} disabled={!formData.kabupaten} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition disabled:bg-gray-100 disabled:text-gray-400">
                          <option value="">Pilih Kecamatan</option>
                          {districts.map(dist => <option key={dist.id} value={dist.id}>{dist.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desa/Kelurahan</label>
                        <select required name="desa" value={formData.desa} onChange={handleDesaChange} disabled={!formData.kecamatan} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition disabled:bg-gray-100 disabled:text-gray-400">
                          <option value="">Pilih Desa/Kelurahan</option>
                          {villages.map(vil => <option key={vil.id} value={vil.id}>{vil.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RT</label>
                        <input required type="text" name="rt" value={formData.rt} onChange={handleChange} placeholder="Contoh: 001" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RW</label>
                        <input required type="text" name="rw" value={formData.rw} onChange={handleChange} placeholder="Contoh: 002" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Detail</label>
                      <textarea required name="alamat_detail" value={formData.alamat_detail} onChange={handleChange} placeholder="Nama jalan, perumahan, blok, no rumah..." rows="2" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Orang Tua / Wali</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ayah</label>
                    <input type="text" name="nama_ayah" value={formData.nama_ayah} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Nama Ayah" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                    <input type="text" name="nama_ibu" value={formData.nama_ibu} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Nama Ibu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp Aktif</label>
                    <input type="text" name="no_wa_utama" value={formData.no_wa_utama} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] outline-none transition" placeholder="Contoh: 081234567890" />
                    <p className="text-xs text-gray-500 mt-1">Nomor ini akan digunakan untuk notifikasi kelulusan.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Berkas</h2>
                  
                  {/* Row 1: Foto 3x4 */}
                  <div className="flex justify-center mb-6">
                    <div className="w-full max-w-sm p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center hover:bg-gray-100 transition relative overflow-hidden">
                      {fotoPreview ? (
                        <img src={fotoPreview} alt="Preview Foto" className="mx-auto h-32 w-24 object-cover rounded shadow-sm mb-3 border border-gray-200" />
                      ) : (
                        <FaUser className="text-4xl text-[#007bff] mx-auto mb-3" />
                      )}
                      <p className="font-semibold text-gray-700">Pas Foto 3x4</p>
                      <p className="text-xs text-gray-500 mb-4">Wajib terlihat jelas</p>
                      <input type="file" name="foto_file" onChange={handleFileChange} required accept="image/*" className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#007bff]/10 file:text-[#007bff] hover:file:bg-[#007bff]/20" />
                    </div>
                  </div>

                  {/* Row 2: KK & Akta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* KK */}
                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center hover:bg-gray-100 transition">
                      <FaFileUpload className="text-4xl text-[#007bff] mx-auto mb-3" />
                      <p className="font-semibold text-gray-700">Kartu Keluarga</p>
                      <p className="text-xs text-gray-500 mb-4">Format: JPG, PNG, PDF.</p>
                      <input type="file" name="kk_file" onChange={handleFileChange} required className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#007bff]/10 file:text-[#007bff] hover:file:bg-[#007bff]/20" />
                    </div>

                    {/* AKTA */}
                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center hover:bg-gray-100 transition">
                      <FaFileUpload className="text-4xl text-[#007bff] mx-auto mb-3" />
                      <p className="font-semibold text-gray-700">Akta Kelahiran</p>
                      <p className="text-xs text-gray-500 mb-4">Format: JPG, PNG, PDF.</p>
                      <input type="file" name="akta_file" onChange={handleFileChange} required className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#007bff]/10 file:text-[#007bff] hover:file:bg-[#007bff]/20" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Data</h2>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold border-b pb-2 mb-4">Siswa</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-500">NIK:</span>
                      <span className="font-medium text-gray-800">{formData.nik || '-'}</span>
                      <span className="text-gray-500">Nama Lengkap:</span>
                      <span className="font-medium text-gray-800">{formData.nama_lengkap || '-'}</span>
                      <span className="text-gray-500">Tempat, Tgl Lahir:</span>
                      <span className="font-medium text-gray-800">{formData.tempat_lahir}, {formData.tanggal_lahir ? new Date(formData.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</span>
                      <span className="text-gray-500">Alamat:</span>
                      <span className="font-medium text-gray-800">{formData.alamat_detail ? `${formData.alamat_detail}, RT ${formData.rt}/RW ${formData.rw}, ${formData.desa_name}, ${formData.kecamatan_name}, ${formData.kabupaten_name}, ${formData.provinsi_name}` : '-'}</span>
                    </div>

                    <h3 className="font-semibold border-b pb-2 mt-6 mb-4">Orang Tua</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-500">Nama Ayah:</span>
                      <span className="font-medium text-gray-800">{formData.nama_ayah || '-'}</span>
                      <span className="text-gray-500">Nama Ibu:</span>
                      <span className="font-medium text-gray-800">{formData.nama_ibu || '-'}</span>
                      <span className="text-gray-500">No. WhatsApp:</span>
                      <span className="font-medium text-gray-800">{formData.no_wa_utama || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="px-6 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                    Kembali
                  </button>
                ) : (
                  <button type="button" onClick={() => navigate('/')} className="px-6 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                    Batal
                  </button>
                )}
                
                <button type="submit" className="px-8 py-3 rounded-full font-bold text-white bg-[#007bff] hover:bg-[#0056b3] shadow-md transition transform hover:-translate-y-1">
                  {step === 4 ? 'Kirim Pendaftaran' : 'Selanjutnya'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform scale-100 transition-transform">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-[#007bff]" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-center text-gray-600 mb-6">
              No Registrasi Anda:<br/>
              <span className="font-bold text-[#007bff] text-lg">{registeredNo}</span>
            </p>
            <button 
              onClick={handleCloseModal}
              className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/30"
            >
              Tutup & Cek Status
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform scale-100 transition-transform">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-4xl text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Pendaftaran Gagal</h3>
            <p className="text-center text-gray-600 mb-6">
              {errorModal.message}
            </p>
            <button 
              onClick={() => setErrorModal({ show: false, message: '' })}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-500/30"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <footer className="py-4 text-center text-xs text-gray-500 mt-auto">
        &copy; {new Date().getFullYear()} Penerimaan Murid Baru Madrasah <b>MI Cikembulan</b>. All rights reserved.
      </footer>
    </div>
  );
};

export default RegisterForm;
