// client/src/auth/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nearBeerUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('nearBeerUser', JSON.stringify(userData));
    localStorage.setItem('nearBeerToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nearBeerUser');
    localStorage.removeItem('nearBeerToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
