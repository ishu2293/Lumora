import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("lumora_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("lumora_token") || null;
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8080/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(async res => {
                const contentType = res.headers.get("content-type");
                if (res.ok && contentType && contentType.includes("application/json")) {
                    return res.json();
                }
                throw new Error("Invalid session");
            })
            .then(data => {
                setUser(data);
                localStorage.setItem("lumora_user", JSON.stringify(data));
            })
            .catch(() => {
                logout();
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("lumora_user", JSON.stringify(userData));
        localStorage.setItem("lumora_token", authToken);
    };

    const register = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("lumora_user", JSON.stringify(userData));
        localStorage.setItem("lumora_token", authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("lumora_user");
        localStorage.removeItem("lumora_token");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
