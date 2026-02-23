import './HelpPage.css';

function HelpPage() {
  const helplines = [
    {
      name: 'National Emergency Number',
      number: '112',
      description: 'All-in-one emergency number for police, fire, and medical emergencies',
      icon: '🚨'
    },
    {
      name: 'Ambulance Services',
      number: '102 / 108',
      description: 'Free ambulance services across India',
      icon: '🚑'
    },
    {
      name: 'Mental Health Helpline',
      number: '08046110007',
      description: 'Vandrevala Foundation - 24/7 mental health support',
      icon: '🧠'
    },
    {
      name: 'Poison Control',
      number: '1800-425-1213',
      description: 'All India Institute of Medical Sciences (AIIMS) - Poison Information Centre',
      icon: '☠️'
    },
    {
      name: 'Women Helpline',
      number: '181',
      description: '24/7 helpline for women in distress',
      icon: '👩'
    },
    {
      name: 'Child Helpline',
      number: '1098',
      description: 'National helpline for children in need',
      icon: '👶'
    }
  ];

  const govSites = [
    {
      name: 'Ministry of Health & Family Welfare',
      url: 'https://www.mohfw.gov.in/',
      description: 'Official government health ministry website',
      icon: '🏛️'
    },
    {
      name: 'AIIMS New Delhi',
      url: 'https://www.aiims.edu/',
      description: 'All India Institute of Medical Sciences',
      icon: '🏥'
    },
    {
      name: 'Central Drugs Standard Control Organization',
      url: 'https://cdsco.gov.in/',
      description: 'Drug regulatory authority of India',
      icon: '💊'
    },
    {
      name: 'National Health Portal',
      url: 'https://www.nhp.gov.in/',
      description: 'Comprehensive health information portal',
      icon: '📋'
    },
    {
      name: 'Ayushman Bharat',
      url: 'https://pmjay.gov.in/',
      description: 'National health protection scheme',
      icon: '🛡️'
    },
    {
      name: 'WHO India',
      url: 'https://www.who.int/india',
      description: 'World Health Organization - India office',
      icon: '🌍'
    }
  ];

  return (
    <div className="help-page">
      <div className="help-hero">
        <h1 className="help-title">Need Help?</h1>
        <p className="help-subtitle">Emergency contacts and trusted medical resources</p>
      </div>

      {/* Emergency Helplines */}
      <section className="help-section">
        <h2 className="section-heading">
          <span className="heading-icon">📞</span>
          Emergency Helplines
        </h2>
        <div className="helplines-grid">
          {helplines.map((helpline, idx) => (
            <div key={idx} className="helpline-card">
              <div className="helpline-icon">{helpline.icon}</div>
              <div className="helpline-content">
                <h3 className="helpline-name">{helpline.name}</h3>
                <a href={`tel:${helpline.number.replace(/\s/g, '')}`} className="helpline-number">
                  {helpline.number}
                </a>
                <p className="helpline-description">{helpline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Government Medical Sites */}
      <section className="help-section">
        <h2 className="section-heading">
          <span className="heading-icon">🔗</span>
          Government & Trusted Medical Resources
        </h2>
        <div className="resources-grid">
          {govSites.map((site, idx) => (
            <a 
              key={idx} 
              href={site.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="resource-card"
            >
              <div className="resource-icon">{site.icon}</div>
              <div className="resource-content">
                <h3 className="resource-name">{site.name}</h3>
                <p className="resource-description">{site.description}</p>
                <span className="resource-link">
                  Visit Website →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="help-section">
        <div className="important-notice">
          <h3>⚠️ Important Reminders</h3>
          <ul>
            <li>In case of emergency, always call 112 first</li>
            <li>MediScan is for informational purposes only - not for medical diagnosis</li>
            <li>Always consult qualified healthcare professionals for medical advice</li>
            <li>Keep your doctor's contact information easily accessible</li>
            <li>Never delay seeking medical attention in emergencies</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;