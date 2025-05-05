// About.jsx
import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-text">
        <h2>How it works</h2>
        <ol>
          <li>Pick your date and squad size</li>
          <li>Get your mission briefing via a WhatsApp message</li>
          <li>Reply ‘START’ to launch your adventure</li>
          <li>
            Crack cheeky clues and discover Brighton’s spicy, sex-positive
            secrets
          </li>
          <li>
            Each participant receives a free adult gift from a legendary
            Brighton sex shop—plus a celebratory drink at a top Brighton bar!
          </li>
        </ol>
      </div>

      <div className="about-cloud">
        <img src="/orange_blob.png" alt="cloud shape" className="cloud-image" />
        <img src="/about.png" alt="Adventure group" className="cloud-img-inside" />
      </div>
    </div>
  );
};

export default About;
