import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setAuthToken } from "../middleware/signalrService";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

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
            // Set the auth token for SignalR service
            setAuthToken(storedToken);
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("jwt_token", newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        // Set the auth token for SignalR service
        setAuthToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setToken(null);
        setIsAuthenticated(false);
        // Clear the auth token from SignalR service
        setAuthToken(null);
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