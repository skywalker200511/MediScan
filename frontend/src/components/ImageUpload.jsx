import { useState } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageUpload(reader.result); // Send to parent component
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="image-upload-container">
      <h2>📸 Upload Medicine Image</h2>
      
      {!preview ? (
        <div
          className={`upload-box ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <label htmlFor="file-input" className="upload-label">
            <div className="upload-icon">📷</div>
            <p className="upload-text">Click to upload or drag and drop</p>
            <p className="upload-subtext">PNG, JPG, JPEG (Max 10MB)</p>
          </label>
        </div>
      ) : (
        <div className="preview-container">
          <img src={preview} alt="Medicine preview" className="preview-image" />
          {!isLoading && (
            <button onClick={clearImage} className="clear-btn">
              ✕ Clear Image
            </button>
          )}
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Analyzing medicine...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;