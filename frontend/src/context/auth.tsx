import Cookies from "js-cookie";
import { createContext, use, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { useGetAuthUser } from "@/hooks/useUsers";
import constant from "@/lib/constant";

interface AuthContextProps {
  user?: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch the user details if a refresh token is present
  const { isLoading, data } = useGetAuthUser();

  const login = (accessToken: string, user: User) => {
    Cookies.set(constant.ACCESS_TOKEN_KEY, accessToken, {
      expires: constant.ACCESS_TOKEN_EXPIRE,
    });

    setUser(user);
    queryClient.setQueryData(["users", "me"], user);
  };

  const logout = async () => {
    Cookies.remove(constant.ACCESS_TOKEN_KEY);
    setUser(null);
  };

  useEffect(() => {
    if (!isLoading && !!data) {
      setUser(data);
    }
  }, [data, isLoading]);

  return (
    <AuthContext
      value={{
        user,
        loading: isLoading,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be within an AuthProvider");
  }
  return context;
}
