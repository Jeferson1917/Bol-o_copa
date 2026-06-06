import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import RankingPage from './pages/RankingPage';
import PredictionsPage from './pages/PredictionsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          toastOptions={{
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navbar />
                <RankingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ranking" 
            element={
              <ProtectedRoute>
                <Navbar />
                <RankingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/predictions" 
            element={
              <ProtectedRoute>
                <Navbar />
                <PredictionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Navbar />
                  <AdminPage />
                </AdminRoute>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
