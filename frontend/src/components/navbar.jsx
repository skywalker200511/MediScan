import { useState } from 'react';
import './navbar.css';

function Navbar({ onNavigate, currentPage }) {
  const [activeTab, setActiveTab] = useState(currentPage || 'home');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => {
          setActiveTab('home');
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5L20 35M35 20L5 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
          </div>
          <span className="logo-text">
            Medi<span className="logo-highlight">Scan</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('home');
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('assistant');
              onNavigate('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            MediScan Assistant
          </button>
          <button 
            className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('help');
              onNavigate('help');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Help
          </button>
        </div>

        {/* CTA Button */}
        <button className="navbar-cta" onClick={() => {
          setActiveTab('assistant');
          onNavigate('chat');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          Try Now →
        </button>
      </div>
    </nav>
  );
}

export default Navbar;