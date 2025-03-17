import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'student' | 'teacher'|"admin") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);

  // Load the user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
  }, []);

  const login = async(username: string, password: string, role: 'student' | 'teacher'|"admin") => {
    let result = await fetch(`${import.meta.env.VITE_HOST}/auth/login`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({username,password,role})
    })
    let res = await result.json()

   if(res.status === "success"){
    setUser({username:res.user.username,name:res.user.name,role:res.user.role})
    localStorage.setItem('user', JSON.stringify({name:res.user.name,username:res.user.username,role:res.user.role}));
    return true
   }
   return false
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
