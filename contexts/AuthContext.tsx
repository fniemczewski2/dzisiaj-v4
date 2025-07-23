// contexts/AuthContext.tsx
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState
} from "react";

WebBrowser.maybeCompleteAuthSession();

type User = {
  name: string | null;
  email: string | null;
  picture?: string | null;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);


  const login = async () => {
    setLoading(true);
    try {
      setUser({
        name: "fniemczewski",
        email: "f.niemczewski2@gmail.com"
      }
      )
    }
    catch (err) {
      console.error('Błąd logowania:', err);
    }
    finally {
      setLoading(false);
    }
  }
  
  const logout = async () => {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);