import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import LandingPageHeroSection from "./components/LandingPage.tsx";
import AboutSection from "./components/about.tsx";
import Footer from "./components/footer.tsx";
import ChatBox from "./components/chatBox.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPageHeroSection />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/chat" element={<ChatBox />} />
        {/* <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
