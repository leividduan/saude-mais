import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = "admin" | "doctor" | "patient";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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

    const newUser = { id: Date.now().toString(), name, email, password, role: "patient" };
    users.push(newUser);
    localStorage.setItem('clinica_users', JSON.stringify(users));

    const userToStore = { id: newUser.id, name, email, role: newUser.role };
    setUser(userToStore);
    localStorage.setItem('clinica_user', JSON.stringify(userToStore));

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('clinica_users') || '[]');
    const userFound = users.find((u: any) => u.email === email && u.password === password);

    if (!userFound) {
      return { success: false, error: 'E-mail ou senha incorretos' };
    }
    
    let role: UserRole = "patient";
    if (userFound.email === "admin@example.com") {
      role = "admin";
    } else if (userFound.email === "doctor@example.com") {
      role = "doctor";
    }

    const userToStore = { id: userFound.id, name: userFound.name, email: userFound.email, role };
    setUser(userToStore);
    localStorage.setItem('clinica_user', JSON.stringify(userToStore));

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
