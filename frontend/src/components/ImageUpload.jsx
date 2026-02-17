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

  // NEW: Compress image before sending
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Resize if too large
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 70% quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Compress before sending to API
    const compressed = await compressImage(file);
    onImageUpload(compressed);
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

  const openCamera = () => {
    document.getElementById('camera-input').click();
  };

  return (
    <div className="image-upload-container">
      <h2>📸 Upload Medicine Image</h2>
      
      {!preview ? (
        <>
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
            
            <input
              type="file"
              id="camera-input"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-icon">📷</div>
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-subtext">PNG, JPG, JPEG (Max 10MB)</p>
            </label>
          </div>

          <div className="camera-options">
            <button className="camera-btn" onClick={openCamera}>
              📱 Take Photo with Camera
            </button>
          </div>
        </>
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