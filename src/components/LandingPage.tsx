import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./compomentStyles/LandingPage.css";

const LandingPageHeroSection = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="LandingPageHeroSection">
      <div className="hero-text-header">
        <h1>EXPERIENCE TALKWITHAYODEJI CHARM WITH OUR CHATBOT.</h1>
        <p>
          Dive into a delightful conversation with our chatbot. It's designed
          to engage you with a warm, welcoming interaction that feels both
          familiar and enchanting.
        </p>
        <div className="hero-buttons">
          <Link to={isAuthenticated ? "/chat" : "/login"} className="hero-button">
            {isAuthenticated ? "Continue Chatting" : "Admin Login"}
          </Link>
          {/* <button className="hero-button-secondary">Learn More</button> */}
        </div>
      </div>

      <div className="hero-image">
        <img src="/images/Hero-image.jpg" alt="Hero image" />
      </div>
    </div>
  );
};

export default LandingPageHeroSection;
