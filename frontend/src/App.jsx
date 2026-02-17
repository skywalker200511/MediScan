import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import MedicineInfo from './components/MedicineInfo'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState(null);

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
      <header>
        <div className="header-badge">✦ AI Powered</div>
        <h1>MediScan</h1>
        <p>Upload a medicine photo for instant AI-powered identification</p>
        <div className="header-line"></div>
      </header>
      
      <main>
        <ImageUpload 
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />
        
        <MedicineInfo 
          medicineData={medicineInfo}
          isLoading={isLoading}
        />
      </main>

      <footer className="app-footer">
        <p>MediScan © 2026 · Powered by Gemini AI · For informational purposes only</p>
      </footer>
    </div>
  )
}

export default App