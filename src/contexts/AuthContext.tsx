'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChange,
  signIn as authSignIn,
  signOut as authSignOut,
  registerUser as authRegisterUser,
  LoginData,
  RegistrationData,
} from '@/lib/authService';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: LoginData) => Promise<void>;
  signOut: () => Promise<void>;
  registerUser: (data: RegistrationData) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  registerUser: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (data: LoginData) => {
    try {
      await authSignIn(data);
    } catch (error) {
      console.error('Error in sign in:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error in sign out:', error);
      throw error;
    }
  };

  // Register function
  const registerUser = async (data: RegistrationData) => {
    try {
      await authRegisterUser(data);
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  };

  // Create the value object that will be provided by the context
  const value = {
    user,
    loading,
    signIn,
    signOut,
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
