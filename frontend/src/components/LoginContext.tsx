import { Loading } from "../icons/Loading";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// Define user token interface
interface UserToken {
  exp: number;
  [key: string]: any; // Allows additional properties
}

// Define context type
interface LoginContextType {
  loggedIn: boolean;
  user: UserToken | null;
  login: (token: UserToken) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserToken | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const token: UserToken = JSON.parse(tokenString);
        const currentTime = Date.now() / 1000;

        if (token.exp + 2 * 60 < currentTime) {
          logout();
        } else {
          setLoggedIn(true);
          setUser(token);
        }
      } else {
        setLoggedIn(false);
      }
    } catch (e) {
      localStorage.removeItem("token");
      console.error("Error reading token:", e);
    }
  }, []);

  const login = (token: UserToken) => {
    localStorage.setItem("token", JSON.stringify(token));
    setUser(token);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoggedIn(false);

    setTimeout(() => {
      navigate("/login");
    }, 100); // Ensures state updates before navigation
  };

  return (
    <LoginContext.Provider value={{ loggedIn, login, logout, user }}>
      {children}
    </LoginContext.Provider>
  );
};
