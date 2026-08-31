import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, getMe, register as registerApi } from '../services/authService';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.user);
          setProfile(res.data.profile || null);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (loginValue, password) => {
    try {
      const res = await loginApi(loginValue, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsAuthenticated(true);

      // Fetch full profile
      try {
        const meRes = await getMe();
        setProfile(meRes.data.profile || null);
      } catch (e) {
        // ignore
      }

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${res.data.user.name}!`,
        timer: 2000,
        showConfirmButton: false
      });

      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: message
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerApi(userData);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsAuthenticated(true);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created successfully!',
        timer: 2000,
        showConfirmButton: false
      });

      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: message
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    setProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
