import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
