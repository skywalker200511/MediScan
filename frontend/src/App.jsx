import { useState } from 'react'
import Navbar from './components/navbar'
import ImageUpload from './components/ImageUpload'
import MedicineInfo from './components/MedicineInfo'
import MedicalChat from './components/MedicalChat'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'chat'

  const handleImageUpload = async (imageData) => {
    setIsLoading(true);
    setMedicineInfo(null);

    try {
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/identify-medicine'
        : '/api/identify-medicine';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageData }),
      });

      const data = await response.json();

      if (data.success) {
        setMedicineInfo(data.medicineInfo);
      } else {
        alert('Failed to identify medicine. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to server. Make sure the backend is running!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="hero-section" id="home">
            <div className="hero-content">
              <div className="hero-badge">✦ AI Powered Medicine Identification</div>
              <h1 className="hero-title">
                Identify Any Medicine<br/>
                <span className="gradient-text">Instantly with AI</span>
              </h1>
              <p className="hero-description">
                Upload a photo of any medicine and get detailed information about uses, 
                dosage, side effects, and warnings powered by advanced AI technology.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">99%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">&lt;3s</div>
                  <div className="stat-label">Response Time</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">24/7</div>
                  <div className="stat-label">Available</div>
                </div>
              </div>
            </div>
          </section>

          {/* Assistant Section */}
          <section className="assistant-section" id="assistant-section">
            <main className="main-card">
              <ImageUpload 
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
              />
              
              <MedicineInfo 
                medicineData={medicineInfo}
                isLoading={isLoading}
              />
            </main>
          </section>

          {/* Help Section */}
          <section className="help-section" id="help-section">
            <h2 className="section-title">How It Works</h2>
            <div className="help-cards">
              <div className="help-card">
                <div className="help-icon">📸</div>
                <h3>1. Upload Photo</h3>
                <p>Take a clear photo of your medicine packaging or use an existing image</p>
              </div>
              <div className="help-card">
                <div className="help-icon">🤖</div>
                <h3>2. AI Analysis</h3>
                <p>Our AI instantly identifies the medicine and extracts key information</p>
              </div>
              <div className="help-card">
                <div className="help-icon">💊</div>
                <h3>3. Get Details</h3>
                <p>Receive comprehensive information about uses, dosage, and safety</p>
              </div>
            </div>

            <div className="faq-section">
              <h3 className="faq-title">Frequently Asked Questions</h3>
              <div className="faq-item">
                <strong>Is MediScan accurate?</strong>
                <p>Our AI achieves 99% accuracy in identifying medicines with clear packaging.</p>
              </div>
              <div className="faq-item">
                <strong>Is my data secure?</strong>
                <p>Images are processed in real-time and never stored on our servers.</p>
              </div>
              <div className="faq-item">
                <strong>Can I use this for medical advice?</strong>
                <p>No, MediScan is for informational purposes only. Always consult a healthcare professional.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Chat Page */
        <section className="chat-page-section">
          <MedicalChat />
        </section>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>MediScan © 2026 · Powered by Gemini AI</p>
          <p className="footer-disclaimer">For informational purposes only · Not a substitute for medical advice</p>
        </div>
      </footer>
    </div>
  )
}

export default App