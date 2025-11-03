import ProtectedRoute from "./components/ProtectedRoute";
import DocumentUpload from "./components/DocumentUpload";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import LandingPage from "./components/LandingPage.tsx"; // No change needed here if it was already correct
import AboutSection from "./components/about.tsx";
import ChatBox from "./components/chatBox.tsx";
import Footer from "./components/footer.tsx";
import Login from "./components/Login.tsx";

function AppLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/about" element={<AboutSection />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <DocumentUpload />
            </ProtectedRoute>
          }
        />
        <Route path="/chat" element={<ChatBox />} />
        {/* <Route path="/faq" element={<FAQ />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
      {location.pathname !== "/chat" && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
