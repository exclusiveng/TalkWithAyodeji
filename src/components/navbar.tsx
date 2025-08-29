import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./compomentStyles/navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const toggleMenu = () => setIsOpen(!isOpen);

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar color-black text-color-pink">
            <div className="navbar-logo normal-font-family">
                <Link to="/" onClick={closeMenu}>TalkWithAyodeji</Link>
            </div>

            <button className="menu-toggle" onClick={toggleMenu}>
                {isOpen ? "✖" : "☰"}
            </button>

            <div className={`nav-overlay ${isOpen ? "open" : ""}`}>
                <ul className="nav-links">
                    <li className="normal-font-family">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                    </li>
                    <li className="normal-font-family">
                        <Link to="/about" onClick={closeMenu}>About</Link>
                    </li>
                    {!isAuthenticated ? (
                        <li className="normal-font-family">
                            <Link to="/login" onClick={closeMenu}>Admin Login</Link>
                        </li>
                    ) : (
                        <>
                            <li className="normal-font-family">
                                <Link to="/chat" onClick={closeMenu}>Chat</Link>
                            </li>
                            <li className="normal-font-family">
                                <button onClick={() => { logout(); closeMenu(); }} className="logout-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
