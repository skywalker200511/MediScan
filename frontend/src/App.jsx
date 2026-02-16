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
        const response = await fetch('/api/identify-medicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        <h1>🏥 MediScan</h1>
        <p>AI-Powered Medicine Information Assistant</p>
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
    </div>
  )
}

export default App