import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Menu, X } from "lucide-react";
import "./compomentStyles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>
          TalkWithAyodeji
        </Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Desktop Navigation Links */}
      <ul className="nav-links desktop-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/upload">Upload Documents</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                }}
                className="logout-button"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Mobile Navigation Overlay */}
      <div className={`nav-overlay ${isOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/chat" onClick={closeMenu}>
              Chat
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/upload" onClick={closeMenu}>
                  Upload Documents
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="logout-button"
                >
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
