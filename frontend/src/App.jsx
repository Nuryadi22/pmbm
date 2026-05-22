import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterForm from './pages/RegisterForm';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPendaftar from './pages/AdminPendaftar';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';

const ProtectedRoute = ({ children }) => {
  if (!sessionStorage.getItem('adminToken')) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const PublicAdminRoute = ({ children }) => {
  if (sessionStorage.getItem('adminToken')) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/daftar" element={<RegisterForm />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <PublicAdminRoute>
            <AdminLogin />
          </PublicAdminRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="pendaftar" element={<AdminPendaftar />} />
          <Route path="profil" element={<AdminProfile />} />
          <Route path="pengaturan" element={<AdminSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
