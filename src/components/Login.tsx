import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./compomentStyles/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/chat");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const requestBody = {
                userName: username,
                password: password,
            };
            
            const response = await fetch("https://talkwithayodeji.onrender.com/api/Auth/admin/login", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                // Try alternative endpoint without /api prefix
                const altResponse = await fetch("https://talkwithayodeji.onrender.com/Auth/admin/login", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });
                
                if (altResponse.ok) {
                    const result = await altResponse.json();
                    
                    if (result.success && result.data?.token) {
                        login(result.data.token);
                        navigate("/chat");
                        return;
                    } else {
                        setError(result.message || "Login failed. Please check your credentials.");
                        return;
                    }
                } else {
                    // Both endpoints failed - show generic error
                    setError("Login failed. Please check your credentials and try again.");
                    return;
                }
            }

            const result = await response.json();

            if (result.success && result.data?.token) {
                // Use the auth context to login with the received token
                login(result.data.token);
                navigate("/chat");
            } else {
                setError(result.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="LoginPage">
            <div className="login-container">
                <div className="login-header">
                    <h1>Admin Login</h1>
                    <p>Enter your credentials to access the admin panel</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="form-input"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="button-group">
                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Login"}
                        </button>
                        
                    </div>
                </form>

                <div className="login-footer">
                    <p>Contact your administrator if you need access credentials.</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 