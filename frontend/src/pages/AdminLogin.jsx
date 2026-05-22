import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/admin/login', { username, password });
      sessionStorage.setItem('adminToken', res.data.token);
      sessionStorage.setItem('adminUser', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal, periksa koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-900">
      {/* Background Image samar-samar */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{ 
          backgroundImage: `url('/src/assets/bg.jpg')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'blur(3px)'
        }}
      />
      
      {/* Overlay untuk mempermanis */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004085]/40 to-transparent z-1"></div>

      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 z-10 relative">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#004085]/10 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-2xl text-[#004085]" />
          </div>
          <h1 className="text-2xl font-bold text-[#004085]">Login Administrator</h1>
          <p className="text-sm text-gray-500 mt-1">PMBM MI Cikembulan</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#007bff] focus:outline-none transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#004085] hover:bg-[#002752] text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
