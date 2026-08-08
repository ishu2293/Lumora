import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import "./Auth.css";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const payload = isLogin ? { email, password } : { username, email, password };

        try {
            const res = await fetch(`http://localhost:8080${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Non-JSON Response received:", text);
                throw new Error("Unable to connect to server. Please verify your backend server is running on port 8080.");
            }

            if (!res.ok) {
                throw new Error(data.error || "Authentication failed.");
            }

            if (isLogin) {
                login(data.user, data.token);
            } else {
                register(data.user, data.token);
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.message || "Failed to connect to backend server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">Lumora</div>
                    <div className="auth-subtitle">
                        {isLogin ? "Welcome back! Log in to access your chats." : "Create an account to get started."}
                    </div>
                </div>

                <div className="auth-tabs">
                    <button 
                        className={`auth-tab ${isLogin ? "active" : ""}`}
                        onClick={() => { setIsLogin(true); setError(""); }}
                        type="button"
                    >
                        Log In
                    </button>
                    <button 
                        className={`auth-tab ${!isLogin ? "active" : ""}`}
                        onClick={() => { setIsLogin(false); setError(""); }}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                id="username"
                                type="text" 
                                className="input-field" 
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            className="input-field" 
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            className="input-field" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Processing..." : isLogin ? "Log In" : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
