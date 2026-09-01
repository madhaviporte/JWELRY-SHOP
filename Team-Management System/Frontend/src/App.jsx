import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import MemberDetails from './pages/MemberDetails';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Map routes to page titles
const getPageTitle = (pathname) => {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.startsWith('/team/')) return 'Member Details';
  if (pathname === '/team') return 'Team Members';
  if (pathname === '/tasks') return 'Tasks';
  if (pathname === '/profile') return 'Profile Settings';
  return 'TeamFlow';
};

// Layout wrapper for authenticated pages
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const title = getPageTitle(location.pathname);

  if (!isAuthenticated) return null;

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="app-layout__main">
        <Navbar
          title={title}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-layout__content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<MemberDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
