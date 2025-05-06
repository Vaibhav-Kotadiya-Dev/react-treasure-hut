// About.jsx
import React from "react";
import "./about.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-cloud">
        <div className="right-text-wrapper">
          <h1>A</h1>
          <h1>B</h1>
          <h1>O</h1>
          <h1>U</h1>
          <h1>T</h1>
        </div>

        <img
          src="/about.png"
          alt="Adventure group"
          className="cloud-img-inside"
        />
      </div>
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
    </div>
  );
};

export default About;
