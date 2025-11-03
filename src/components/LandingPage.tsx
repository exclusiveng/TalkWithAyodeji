import { Link } from "react-router-dom";
import "./compomentStyles/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">Meet My Personal AI Chatbot</h1>
          <p className="hero-subheadline">
            Instead of scrolling through pages, just ask. My chatbot gives you
            instant, accurate answers about me, my work, and my projects.
          </p>
          <Link to="/chat" className="cta-button">
            Start Chatting Now
          </Link>
        </div>
      </section>

      {/* What it does Section */}
      <section className="feature-section">
        <h2 className="section-title">What the Chatbot Does</h2>
        <p className="section-subheading">
          Curious about who I am or what I do? This chatbot is built to answer
          your questions directly.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Learn About Me</h3>
            <p>Discover my background, expertise, and professional journey.</p>
          </div>
          <div className="feature-card">
            <h3>Explore Projects</h3>
            <p>
              Dive into the projects I’ve worked on and understand the
              technologies used.
            </p>
          </div>
          <div className="feature-card">
            <h3>Connect & Collaborate</h3>
            <p>
              Find quick ways to get in touch or discuss potential
              collaborations.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Ask a Question</h3>
            <p>
              Type your question in the chat box, just like you would in a
              normal conversation.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Instant Answers</h3>
            <p>
              Receive reliable answers based on my professional profile and
              project history.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Learn and Discover</h3>
            <p>Explore more about me without navigating through pages.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
