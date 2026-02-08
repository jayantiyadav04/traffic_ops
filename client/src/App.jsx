import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterViolation from './pages/RegisterViolation';
import ViewViolations from './pages/ViewViolations';
import Analytics from './pages/Analytics';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/violations" element={<ViewViolations />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin', 'officer']} />}>
              <Route path="/register-violation" element={<RegisterViolation />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
