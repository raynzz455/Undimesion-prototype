import React, { useState, useEffect } from 'react';
import './home.css';

const quotes = [
  {
    text: "I yearn for my country to be free from the chains of corruption, for its people to walk in the light of integrity.",
    author: "Reza"
  },
  {
    text: "Together we can build a brighter future for the next generations.",
    author: "Abyan"
  },
  {
    text: "Hope is the light that guides us through the darkest times.",
    author: "Rifqi"
  },
  {
    text: "In unity, we find strength and resilience.",
    author: "Rasya"
  },
  {
    text: "Every dream has the power to change the world.",
    author: "Aldi"
  },
  {
    text: "Let us stand together for justice and peace.",
    author: "Raditya"
  },
  {
    text: "Our voices matter; let them be heard.",
    author: "Razka"
  },
];

function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteChangeInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000); 

    return () => clearInterval(quoteChangeInterval);
  }, []);

  return (
    <div className='home-main main-content'>
      <div className='home-hero-container'>
        <div className='home-hero'>
          <div className='hero-text-container'>
            <p>Our dreams shine eternal</p>
            <p>like the stars that grace</p>        
            <p>the night.</p>
          </div>
        </div>

        <div className='home-container1'>
          <div className='hero-hopes-text'>
            <p>Our dreams and hopes.</p>
          </div>

          <div className='home-hopes-container'>
            
            <div className='home-hopes-section1'>
              <div className='home-indonesia-images-container'>
                <img src={`${process.env.PUBLIC_URL}/assets/Prambanan.jpeg`} alt="indonesia" className='indonesia-pictures'/>
              </div>
              <p className='home-indonesia'>Dreams to Our Countries</p>
              <div className='home-indonesia-text-container'>
                <div className='home-indonesia-text-quote'>
                <p>{quotes[currentQuote].text}</p>
                </div>
                <div className='home-indonesia-text-owner'>
                  <p>-{quotes[currentQuote].author}</p>
                </div>
              </div>
            </div>
            <div className='home-hopes-section1'>
              <div className='home-indonesia-images-container'>
                <img src={`${process.env.PUBLIC_URL}/assets/7266871.jpg`} alt="indonesia" className='indonesia-pictures'/>
              </div>
              <p className='home-indonesia'>Hopes to Our City</p>
              <div className='home-indonesia-text-container'>
                <div className='home-indonesia-text-quote'>
                <p>{quotes[currentQuote].text}</p>
                </div>
                <div className='home-indonesia-text-owner'>
                  <p>-{quotes[currentQuote].author}</p>
                </div>
              </div>
            </div>
            <div className='home-hopes-section1'>
              <div className='home-indonesia-images-container'>
                <img src={`${process.env.PUBLIC_URL}/assets/Prambanan.jpeg`} alt="indonesia" className='indonesia-pictures'/>
              </div>
              <p className='home-indonesia'>Dreams Countries</p>
              <div className='home-indonesia-text-container'>
                <div className='home-indonesia-text-quote'>
                <p>{quotes[currentQuote].text}</p>
                </div>
                <div className='home-indonesia-text-owner'>
                  <p>-{quotes[currentQuote].author}</p>
                </div>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
