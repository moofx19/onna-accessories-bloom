
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/api';
import { toast } from '../components/ui/sonner';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; first_name: string; last_name: string; phone: string }) => Promise<boolean>;
  logout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.auth.login({ email, password }) as AuthResponse;
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        
        // Save to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        toast('Login successful', {
          description: `Welcome back, ${response.user.first_name}!`,
        });
        
        setShowLoginDialog(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast('Login failed', {
        description: 'Please check your credentials and try again.',
      });
      return false;
    }
  };

  const register = async (userData: { email: string; password: string; first_name: string; last_name: string; phone: string }): Promise<boolean> => {
    try {
      const response = await apiService.auth.register(userData) as AuthResponse;
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        
        // Save to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        toast('Registration successful', {
          description: `Welcome, ${response.user.first_name}!`,
        });
        
        setShowLoginDialog(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast('Registration failed', {
        description: 'Please try again with different details.',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      if (user?.email) {
        await apiService.auth.logout(user.email);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      toast('Logged out', {
        description: 'You have been successfully logged out.',
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user && !!token,
        login, 
        register, 
        logout,
        showLoginDialog,
        setShowLoginDialog
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
