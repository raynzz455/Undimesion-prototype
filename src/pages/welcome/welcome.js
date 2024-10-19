import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

function Welcome({ onWelcome }) {
  const navigate = useNavigate();
  const [isSun, setIsSun] = useState(true);
  const [jupiterPosition, setJupiterPosition] = useState({ x: 300, y: 50 });

  const handleWelcomeClick = () => {
    onWelcome();
    navigate('/');
  };

  const handleClick = () => {
    setIsSun(prev => !prev);
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

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
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
          style={{ top: `${jupiterPosition.y}px`, left: `${jupiterPosition.x}px`, cursor: 'grab', position: 'absolute' }}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <img alt="jupiter" src={`${process.env.PUBLIC_URL}/assets/jupiter.png`} />
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

      <div class="text-container">
        <p className='kinda'>kinda funny if
        </p>
        <p className='dont-see'>you don't see it</p>
      </div>
      <div>
        <button onClick={handleWelcomeClick} className='start-button'>Lets Explore!</button>
      </div>
        </div>
        
      <p className='byn'>kredit : ByanKeren</p>
    </div>
  );
}

export default Welcome;