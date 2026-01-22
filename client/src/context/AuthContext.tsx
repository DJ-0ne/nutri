import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  user: { id: string; name?: string } | null;
  isLoading: boolean;
  login: (userData?: { id: string; name?: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = (userData?: { id: string; name?: string }) => {
    const defaultUser = { id: "demo-user", name: "Test User" };
    setUser(userData ?? defaultUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}