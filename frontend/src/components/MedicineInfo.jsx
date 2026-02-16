import './MedicineInfo.css';

function MedicineInfo({ medicineData, isLoading }) {
  if (isLoading) {
    return (
      <div className="medicine-info-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Analyzing your medicine...</p>
        </div>
      </div>
    );
  }

  if (!medicineData) {
    return null; // Don't show anything if no data
  }

  return (
    <div className="medicine-info-container">
      <div className="info-header">
        <h2>💊 Medicine Information</h2>
      </div>
      
      <div className="info-content">
        {/* Display the AI response */}
        <div className="ai-response">
          {medicineData.split('\n').map((line, index) => {
            // Handle headers (lines starting with ##)
            if (line.startsWith('##')) {
              return <h3 key={index}>{line.replace('##', '').trim()}</h3>;
            }
            // Handle bold text (wrapped in **)
            if (line.includes('**')) {
              const parts = line.split('**');
              return (
                <p key={index}>
                  {parts.map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
              );
            }
            // Handle bullet points
            if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
              return <li key={index}>{line.replace(/^[-*]\s*/, '')}</li>;
            }
            // Regular paragraphs
            if (line.trim()) {
              return <p key={index}>{line}</p>;
            }
            return <br key={index} />;
          })}
        </div>

        <div className="disclaimer">
          <strong>⚠️ Important Disclaimer:</strong>
          <p>This information is for educational purposes only. Always consult with a qualified healthcare professional before taking any medication or making health decisions.</p>
        </div>
      </div>
    </div>
  );
}

export default MedicineInfo;