import { Account, Client, Models } from "appwrite";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Platform } from "react-native";

type User = Models.User<Models.Preferences> | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  login: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
  login: async () => {},
});

const client = new Client()
  .setEndpoint(Constants.expoConfig?.extra?.APPWRITE_ENDPOINT)
  .setProject(Constants.expoConfig?.extra?.APPWRITE_PROJECT_ID);

const account = new Account(client);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
        const redirectUri = makeRedirectUri({
            scheme: "appwrite-callback-6877e1290006c3e6b744",
            native: "appwrite-callback-6877e1290006c3e6b744://auth/callback",
        });

        const loginUrl = `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2?provider=google&success=${encodeURIComponent(
            redirectUri
        )}&failure=${encodeURIComponent(redirectUri)}`;

        if (Platform.OS === "web") {
            // Dla Web przekieruj pełną stronę (wtedy cookie zostanie zapisane!)
            window.location.href = loginUrl;
            } else {
            // Android/iOS – zachowaj WebBrowser.openAuthSessionAsync
            const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);
            if (result.type === "success" && result.url) {
                await fetchUser();
            }
            else {
            throw new Error("Logowanie przerwane przez użytkownika");
            }
        }
    } catch (err) {
      console.error("Błąd logowania:", err);
      throw err;
    }
  };
  const refresh = async () => {
    setLoading(true);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
    } catch {
      // nieistniejąca sesja to też sukces
    } finally {
      await refresh();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔄 Hook do używania kontekstu
export const useAuth = () => useContext(AuthContext);
