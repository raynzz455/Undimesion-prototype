import React from 'react';
import './home.css'

function Home() {
  return (
    <div className='home-main main-content'>
      
      <div className='home-hero-container'>

      <div className='home-hero'>
        <div className='hero-text-container'>
        <p>Our dreams shines eternal</p> 
        <p>like the stars that grace</p>        
        <p>the night’s.</p>
        </div>
      </div>

      
      <div className='home-container1'>

    <div className='hero-hopes-text'>
        <p>Our dreams and hopes.</p>
    </div>

    <div className='home-hopes-container'>
    <div className='home-hopes-section1'>
        <div className='home-indonesia-images-container'>
      <img src={`${process.env.PUBLIC_URL}/assets/2450218.jpg`} alt="indonesia" className='indonesia-pictures'/>
    </div>

        <p className='home-indonesia'>
        For <span className='home-indonesia1'>Indonesia</span>
    </p>
    <div className='home-indonesia-text-container'>

    </div>
    </div>

    </div>

      </div>


        
      </div>

    </div>
  );
}

export default Home;