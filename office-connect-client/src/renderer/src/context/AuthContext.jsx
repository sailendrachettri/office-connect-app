import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const user = await window.store.get('user');
      const token = await window.store.get('accessToken');

      if (user && token) {
        setUser(user);
        setIsAuthenticated(true);
      }

      setLoading(false);
    }

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
