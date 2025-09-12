
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContextInstance";
import type { AuthContextType } from "./AuthContextInstance";



interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    useEffect(() => {
        // Check if token exists in localStorage on component mount
        const storedToken = localStorage.getItem("jwt_token");
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);

        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("jwt_token", newToken);
        setToken(newToken);
        setIsAuthenticated(true);

    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setToken(null);
        setIsAuthenticated(false);

    };

    const value: AuthContextType = {
        isAuthenticated,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 