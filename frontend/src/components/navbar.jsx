import { useState } from 'react';
import './Navbar.css';

function Navbar({ onNavigate }) {
    
  const [activeTab, setActiveTab] = useState('home');

  const scrollToSection = (section) => {
    setActiveTab(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'assistant') {
      document.getElementById('assistant-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'help') {
      document.getElementById('help-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
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
            }}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() =>{
                setActiveTab('assistant');
                onNavigate('chat');
            } }
          >
            MediScan Assistant
          </button>
          <button 
            className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => scrollToSection('help')}
          >
            Help
          </button>
        </div>

        {/* CTA Button */}
        <button className="navbar-cta" onClick={() => scrollToSection('assistant')}>
          Try Now →
        </button>
      </div>
    </nav>
  );
}

export default Navbar;