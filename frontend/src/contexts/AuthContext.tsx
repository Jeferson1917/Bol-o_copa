import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface UserData {
  token: string;
  userId: number;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('bolao_user');
    const storedToken = localStorage.getItem('bolao_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch (e) {
        localStorage.removeItem('bolao_user');
        localStorage.removeItem('bolao_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, userId, email: resEmail, isAdmin } = response.data;
    
    const userData = { userId, email: resEmail, isAdmin };
    localStorage.setItem('bolao_token', token);
    localStorage.setItem('bolao_user', JSON.stringify(userData));
    setUser({ token, ...userData });
  };

  const register = async (email: string, password: string) => {
    const response = await api.post('/api/auth/register', { email, password });
    const { token, userId, email: resEmail, isAdmin } = response.data;
    
    const userData = { userId, email: resEmail, isAdmin };
    localStorage.setItem('bolao_token', token);
    localStorage.setItem('bolao_user', JSON.stringify(userData));
    setUser({ token, ...userData });
  };

  const logout = () => {
    localStorage.removeItem('bolao_token');
    localStorage.removeItem('bolao_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
