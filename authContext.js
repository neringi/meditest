// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userid, setUserid] = useState('');

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userid, setUserid }}>
      {children}
    </AuthContext.Provider>
  );
};
