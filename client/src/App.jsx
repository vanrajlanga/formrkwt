import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FormPage from './pages/FormPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">RK WORLD TOWER CRM</h1>
          <div className="flex gap-4">
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
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
