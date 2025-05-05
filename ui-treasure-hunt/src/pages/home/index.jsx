import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="left-pane">
        <div style={{textAlign:'center'}}>
        <img src={'./logo.png'} alt="Puzzle Panda" className="logo" />
        </div>
        <p className="tagline">
          Brighton's <span className="italic">Cheekiest</span> treasure Hunt!
        </p>
        <p className="description">
          Solve fun and naughty clues, explore the city, and celebrate with your friends. Perfect for hens, stags, and other groups looking for a wild day out!
        </p>
        <div style={{textAlign:'center'}}>
        <Button className={"book-btn"} onClick={() => navigate('/book-now')}> BOOK NOW</Button>
        </div>
      </div>

      <div className="right-pane">
        <div className="yellow-blob">
          <div className="image-grid">
            <div className="left-images">
              <img src={'./home_image_1.png'} alt="1" className="blob-img" />
              <img src={'./home_image_2.png'} alt="2" className="blob-img" />
            </div>
            <img src={'./home_image_3.png'} alt="3" className="blob-img tall-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;