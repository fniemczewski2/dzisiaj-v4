// contexts/AuthContext.tsx
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "1076392100281-n2d5mlcbtfnro5bn92lr2lu2f7qnbkns.apps.googleusercontent.com",
      webClientId: "1076392100281-v84uu4n5ghotff7cjvrd1um6vtoug3up.apps.googleusercontent.com"
    })
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)){
        const { user } = response.data;
        setUser({
          name: user.name ?? null,
          email: user.email ?? null,
          picture: user.photo ?? null,
        });
      }
    }
    catch (err) {
      console.error('Błąd logowania:', err);
    }
    finally {
      setLoading(false);
    }
  }
  
  const logout = async () => {
    GoogleSignin.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);