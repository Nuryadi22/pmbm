import React, { useState, useEffect } from 'react';
import { FaUser, FaCamera, FaSave } from 'react-icons/fa';

const AdminProfile = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('admin');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setName(sessionStorage.getItem('adminName') || 'Administrator');
    setPhotoPreview(sessionStorage.getItem('adminPhoto') || null);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 200; // Kompresi gambar menjadi maksimal 200x200 pixel
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Mengubah menjadi base64 dengan kualitas 0.8 (untuk menekan ukuran file ke dalam skala KB)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setPhotoPreview(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem('adminName', name);
      if (photoPreview) {
        sessionStorage.setItem('adminPhoto', photoPreview);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      // Memberitahu komponen lain (seperti AdminLayout) bahwa ada pembaruan
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan. Jika Anda mengunggah foto, ukuran foto terlalu besar untuk penyimpanan memori sementara browser. Silakan gunakan foto yang lebih kecil.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto mt-4">
      <h2 className="text-2xl font-bold text-[#004085] mb-6 border-b pb-4">Profil Saya</h2>
      
      {isSaved && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm flex items-center border border-green-100">
          <FaSave className="mr-2 text-lg" /> <b>Berhasil!</b> Profil Anda telah diperbarui.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-50 flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-6xl text-blue-200 mt-4" />
              )}
            </div>
            <label className="absolute bottom-1 right-1 bg-[#007bff] hover:bg-[#0056b3] text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-105 border-2 border-white">
              <FaCamera />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="text-center sm:text-left pt-2">
            <h3 className="text-lg font-bold text-gray-800">Foto Profil</h3>
            <p className="text-sm text-gray-500 mt-1">Gunakan foto beresolusi tinggi dengan rasio 1:1.<br/>Format: JPG, PNG. Maksimal 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username (Sistem)</label>
            <input 
              type="text" 
              value={username}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Username tidak dapat diubah.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" className="bg-[#004085] hover:bg-[#002752] text-white font-bold py-3 px-8 rounded-xl shadow-md transition flex items-center">
            <FaSave className="mr-2" /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
