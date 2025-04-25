import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Configure axios interceptor for auth headers
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.isAuthenticated]);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await getCurrentUser();
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Session expired. Please login again.'
        });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setAuthState({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
        error: null
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setAuthState({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
        error: null
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const res = await axios.get(`${API_URL}/auth/me`);
      
      setAuthState({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
        error: null
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get user data';
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: errorMessage
      });
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      throw new Error(errorMessage);
    }
  };

  // Update profile
  const updateProfile = async (name: string, email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await axios.put(`${API_URL}/auth/update-profile`, {
        name,
        email
      });
      
      setAuthState(prev => ({
        ...prev,
        user: res.data.user,
        loading: false
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      await axios.put(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
      
      // In development, return the token for testing
      // In production, this would be sent by email
      return res.data.resetToken;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to process password reset';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error (server):', err);
    } finally {
      // Even if server logout fails, clean up on client side
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  };

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        register,
        login,
        logout,
        getCurrentUser,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;