import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
  FaUserShield,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState("Nuryadi");
  const [adminPhoto, setAdminPhoto] = useState(null);

  useEffect(() => {
    setIsProfileOpen(false);
    // Update Browser Title
    const pageTitles = {
      "/admin": "Dashboard | PMBM MI Cikembulan",
      "/admin/pendaftar": "Data Pendaftar | PMBM MI Cikembulan",
      "/admin/pengaturan": "Pengaturan | PMBM MI Cikembulan",
    };
    document.title = pageTitles[location.pathname] || "PMBM MI Cikembulan";
  }, [location.pathname]);

  useEffect(() => {
    const updateProfile = () => {
      setAdminName(sessionStorage.getItem("adminName") || "Nuryadi");
      setAdminPhoto(sessionStorage.getItem("adminPhoto") || null);
    };

    updateProfile();
    window.addEventListener("storage", updateProfile);
    window.addEventListener("profileUpdated", updateProfile);
    return () => {
      window.removeEventListener("storage", updateProfile);
      window.removeEventListener("profileUpdated", updateProfile);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    sessionStorage.removeItem("adminName");
    sessionStorage.removeItem("adminPhoto");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#f4f6f9] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} flex-shrink-0 bg-[#002752] text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out relative z-20`}
      >
        <div className="h-20 flex items-center justify-center border-b border-[#001f40] px-4">
          {isSidebarOpen ? (
            <div className="text-center overflow-hidden w-full whitespace-nowrap animate-fadeIn">
              <img
                src="/src/assets/logo.png"
                alt="Logo MI Cikembulan"
                className="h-14 object-contain mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150x50.png?text=Logo";
                }}
              />
            </div>
          ) : (
            <img src="/src/assets/logo-mini.png" alt="Logo" className="h-10 w-10 object-contain" />
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <Link
            to="/admin"
            className={`flex items-center p-3 rounded-xl transition-all duration-200 ${isActive("/admin") ? "bg-[#007bff] text-white shadow-lg" : "text-gray-300 hover:bg-[#004085]"}`}
            title="Dashboard"
          >
            <FaHome className={`text-xl flex-shrink-0 ${isSidebarOpen ? "mr-3" : "mx-auto"}`} />
            <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>Dashboard</span>
          </Link>
          <Link
            to="/admin/pendaftar"
            className={`flex items-center p-3 rounded-xl transition-all duration-200 ${isActive("/admin/pendaftar") ? "bg-[#007bff] text-white shadow-lg" : "text-gray-300 hover:bg-[#004085]"}`}
            title="Data Pendaftar"
          >
            <FaUsers className={`text-xl flex-shrink-0 ${isSidebarOpen ? "mr-3" : "mx-auto"}`} />
            <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>
              Data Pendaftar
            </span>
          </Link>
          <Link
            to="/admin/pengaturan"
            className={`flex items-center p-3 rounded-xl transition-all duration-200 ${isActive("/admin/pengaturan") ? "bg-[#007bff] text-white shadow-lg" : "text-gray-300 hover:bg-[#004085]"}`}
            title="Pengaturan"
          >
            <FaCog className={`text-xl flex-shrink-0 ${isSidebarOpen ? "mr-3" : "mx-auto"}`} />
            <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>Pengaturan</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#001f40]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
            title="Logout"
          >
            <FaSignOutAlt
              className={`text-xl flex-shrink-0 ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
            />
            <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen min-w-0">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm px-4 sm:px-8 flex justify-between items-center z-10 flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:text-[#007bff] hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
            >
              <FaBars className="text-xl" />
            </button>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[#004085]">
                {location.pathname === "/admin"
                  ? "Dashboard"
                  : location.pathname === "/admin/pendaftar"
                    ? "Data Pendaftar"
                    : location.pathname === "/admin/pengaturan"
                      ? "Pengaturan Sistem"
                      : "Panel Admin"}
              </h1>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#004085] shadow-inner border border-blue-200 overflow-hidden">
                {adminPhoto ? (
                  <img src={adminPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUserShield className="text-lg" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">{adminName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <FaChevronDown
                className={`text-xs text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-fadeIn z-50">
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="text-sm font-bold text-gray-800">{adminName}</p>
                  </div>
                  <Link
                    to="/admin/profil"
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] transition-colors"
                  >
                    <FaUserShield className="mr-3 text-gray-400" /> Profil Saya
                  </Link>
                  <Link
                    to="/admin/pengaturan"
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] transition-colors"
                  >
                    <FaCog className="mr-3 text-gray-400" /> Pengaturan
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                  >
                    <FaSignOutAlt className="mr-3 text-red-400" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 overflow-auto bg-[#f4f6f9] flex flex-col">
          <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="w-full py-4 text-center text-xs text-gray-500 mt-auto border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
            <p>
              © {new Date().getFullYear()} Penerimaan Murid Baru Madrasah <b>MI Cikembulan</b>. All
              rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
