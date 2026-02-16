import { useState } from 'react';
import './MedicineInfo.css';

function MedicineInfo({ medicineData, isLoading }) {
  const [showFullDetails, setShowFullDetails] = useState(false);

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
    return null;
  }

  // Extract key info for summary (first few lines)
  const lines = medicineData.split('\n').filter(line => line.trim());
  const summary = lines.slice(0, 4).join('\n'); // First 4 lines as summary

  return (
    <div className="medicine-info-container">
      <div className="info-header">
        <h2>💊 Medicine Information</h2>
      </div>
      
      <div className="info-content">
        {/* Quick Summary */}
        <div className="quick-summary">
          <h3>📋 Quick Summary</h3>
          <div className="summary-text">
            {summary.split('\n').map((line, index) => {
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
              if (line.trim()) {
                return <p key={index}>{line}</p>;
              }
              return null;
            })}
          </div>
        </div>

        {/* Show More/Less Button */}
        <button 
          className="toggle-details-btn"
          onClick={() => setShowFullDetails(!showFullDetails)}
        >
          {showFullDetails ? '▲ Show Less Details' : '▼ Show More Details'}
        </button>

        {/* Full Details (Collapsible) */}
        {showFullDetails && (
          <div className="full-details">
            <h3>📖 Complete Information</h3>
            <div className="ai-response">
              {medicineData.split('\n').map((line, index) => {
                if (line.startsWith('##')) {
                  return <h3 key={index}>{line.replace('##', '').trim()}</h3>;
                }
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
                if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                  return <li key={index}>{line.replace(/^[-*]\s*/, '')}</li>;
                }
                if (line.trim()) {
                  return <p key={index}>{line}</p>;
                }
                return <br key={index} />;
              })}
            </div>
          </div>
        )}

        {/* Disclaimer - Always visible */}
        <div className="disclaimer">
          <strong>⚠️ Important Disclaimer:</strong>
          <p>This information is for educational purposes only. Always consult with a qualified healthcare professional before taking any medication or making health decisions.</p>
        </div>
      </div>
    </div>
  );
}

export default MedicineInfo;