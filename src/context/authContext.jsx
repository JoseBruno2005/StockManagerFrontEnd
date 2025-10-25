import { createContext, useEffect, useState } from "react";
import LoginService from "../services/auth/LoginService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    async function loginContext(email, password) {
        try {
            await LoginService(email, password);
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
        } catch (error) {
            throw error.response;
        }
    }

    function logoutContext() {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    }

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, loading, loginContext, logoutContext }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
