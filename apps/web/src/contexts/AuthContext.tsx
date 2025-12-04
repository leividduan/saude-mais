import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('clinica_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('clinica_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: 'E-mail já cadastrado' };
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem('clinica_users', JSON.stringify(users));

    const userWithoutPassword = { id: newUser.id, name, email };
    setUser(userWithoutPassword);
    localStorage.setItem('clinica_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('clinica_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'E-mail ou senha incorretos' };
    }

    const userWithoutPassword = { id: user.id, name: user.name, email: user.email };
    setUser(userWithoutPassword);
    localStorage.setItem('clinica_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinica_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
