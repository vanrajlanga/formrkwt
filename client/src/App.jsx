import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { isAuthenticated, clearToken } from './auth';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    clearToken();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">RK WORLD TOWER CRM</h1>
          <div className="flex gap-4 items-center">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition ${
                location.pathname === '/' ? 'bg-white text-purple-900 font-semibold' : 'hover:bg-purple-800'
              }`}
            >
              Form
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg transition ${
                location.pathname === '/admin' ? 'bg-white text-purple-900 font-semibold' : 'hover:bg-purple-800'
              }`}
            >
              Admin
            </Link>
            {loggedIn && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg transition hover:bg-purple-800 text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
