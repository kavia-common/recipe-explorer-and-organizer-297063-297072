import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Mock auth using local state; replace with real backend later. */
  const [user, setUser] = useState(null);

  const signIn = async (email) => {
    setUser({ id: 'u1', email, name: email.split('@')[0] });
  };

  const signUp = async (email) => {
    setUser({ id: 'u1', email, name: email.split('@')[0] });
  };

  const signOut = () => setUser(null);

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access user and auth methods. */
  return useContext(AuthContext);
}
