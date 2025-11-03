import "./compomentStyles/footer.css";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>TalkWithAyodeji</h2>
          <p>Conversations that connect, inspire, and engage.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: hello@talkwithayodeji.com</p>
          <p>Phone: +234 123 456 7890</p>
        </div>

        <div className="footer-socials">
          <h4>Follow Us</h4>
          <ul>
            <li>
              <a
                href="https://twitter.com/talkwithayodeji"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="social-icon" /> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/talkwithayodeji"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="social-icon" /> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/company/talkwithayodeji"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="social-icon" /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/talkwithayodeji"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="social-icon" /> Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} TalkWithAyodeji. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
