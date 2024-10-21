import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LightText from '../../components/welcome/LightText';
import './welcome.css';

function Welcome({ onWelcome }) {
  const navigate = useNavigate();
  const [isSun, setIsSun] = useState(true);
  const [jupiterPosition, setJupiterPosition] = useState({ x: 330, y: 50 });
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  const [isFloating, setIsFloating] = useState(false); 
  const [showMessage, setShowMessage] = useState(false); 
  const [fadeOut, setFadeOut] = useState(false); 
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  const handleWelcomeClick = () => {
    onWelcome();
    navigate('/');
  };

  const handleClick = () => {
    setIsSun(prev => !prev);
    
    if (isSun) {
      setShowMessage(true);
      setFadeOut(false);
      
      setTimeout(() => {
        setFadeOut(true); 
      }, 2000);
      
      setTimeout(() => {
        setShowMessage(false); 
      }, 2200);
    }
  };

  const handleJupiterClick = () => {
    if (!isFloating) {
      setIsFloating(true); 
    }
  };

  const handleBackgroundClick = (e) => {
    if (isFloating && e.target.className !== 'jupiter') {
      const newX = e.clientX - 25; 
      const newY = e.clientY - 25; 
      setJupiterPosition({ x: newX, y: newY });
      setIsFloating(false); 
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", null);
    e.target.style.cursor = "grabbing";
  };

  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const newX = e.clientX - 25;
    const newY = e.clientY - 25;
    setJupiterPosition({ x: newX, y: newY });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  const revealEasterEgg = () => {
    setShowEasterEgg(true);
  };

  const openEasterEgg = () => {
    setIsEasterEggOpen(true);
  };

  const closeEasterEgg = () => {
    setIsEasterEggOpen(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center" onClick={handleBackgroundClick}>
      <div className="container-nav" onClick={handleClick} role="button" aria-label="Toggle day/night mode">
        {isSun ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="nav-icon sun"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="nav-icon moon"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        )}
      </div>

      <div className="container relative" onDragOver={handleDragOver} onDrop={handleDrop}>
        {['mercury', 'globe', 'saturn', 'galaxy'].map((planet) => (
          <div className={`icon ${planet}`} key={planet}>
            <img alt={planet} src={`${process.env.PUBLIC_URL}/assets/${planet}.png`} />
          </div>
        ))}

        <div
          className="icon jupiter"
          style={{
            top: `${jupiterPosition.y}px`,
            left: `${jupiterPosition.x}px`,
            cursor: isMobile ? 'pointer' : 'grab',
            position: 'absolute',
            filter: isFloating ? 'drop-shadow(0 0 10px black)' : 'none' 
          }}
          draggable={!isMobile} 
          onDragStart={!isMobile ? handleDragStart : undefined}
          onDragEnd={!isMobile ? handleDragEnd : undefined}
          onClick={isMobile ? handleJupiterClick : undefined}
        >
          <img alt="jupiter" src={`${process.env.PUBLIC_URL}/assets/jupiter.png`} />
        </div>

        <div className={`easter-egg-container ${showEasterEgg ? 'keliatan' : ''}`} onClick={openEasterEgg}>
        <img src={`${process.env.PUBLIC_URL}/assets/DSCF9590.jpg`} alt="easter-egg" className="easter-egg" />
      </div>

        <div className="astronaut-container">
          <img src={`${process.env.PUBLIC_URL}/assets/Astronout.png`} alt="astronaut" className="astronaut" />
        </div>
      </div>

      <div className='container2'>
        <div className='icon-astro astro1'>
          <img alt="astro1" src={`${process.env.PUBLIC_URL}/assets/asteroid.png`} />
        </div>
        <div className='icon-astro astro2'>
          <img alt="astro1" src={`${process.env.PUBLIC_URL}/assets/asteroids.png`} />
        </div>
        <div className='icon-astro astro3'>
          <img alt="astro1" src={`${process.env.PUBLIC_URL}/assets/asteroid2.png`} />
        </div>
        <div className='icon-astro astro4'>
          <img alt="astro1" src={`${process.env.PUBLIC_URL}/assets/asteroid-belt.png`} />
        </div>
        <div className='icon-astro astro5'>
          <img alt="astro1" src={`${process.env.PUBLIC_URL}/assets/space-rock.png`} />
        </div>
        <LightText revealEasterEgg={revealEasterEgg} />
        <div>
          <button onClick={handleWelcomeClick} className='start-button-light'>Lets Explore!</button>
        </div>
      </div>  

      {showMessage && (
        <div className={`message ${fadeOut ? 'fade-out' : ''}`}>
         <p>Don't expect anything 
          </p> because this feature is not working yet
        </div>
      )}

       {isEasterEggOpen && (
        <div className="fullscreen-easter-egg" onClick={closeEasterEgg}>
          <img src={`${process.env.PUBLIC_URL}/assets/DSCF9590.jpg`} alt="easter-egg-full" className="fullscreen-image" />
          <button className="close-button" onClick={closeEasterEgg}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          </button>
        </div>
      )}

      <p className='byn'>kredit : ByanKeren</p>
    </div>
  );
}

export default Welcome;
