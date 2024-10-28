import React, { useState, useEffect } from 'react';
import './home.css';
import { TypeAnimation } from 'react-type-animation';
import { ReactSVG } from 'react-svg';

const Countries = [
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
      setCurrentQuote((prev) => (prev + 1) % Countries.length);
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
            
            <div className='home-hopes-section'>
              <div className='home-images-container'>
                <div className='indonesia-pictures' />
              </div>
              <p className='home-indonesia'>Dreams to Our Countries</p>
              <div className='home-indonesia-text-container'>
                <div className='home-indonesia-text-quote'>
                <p>{Countries[currentQuote].text}</p>
                </div>
                <div className='home-indonesia-text-owner'>
                  <p>-{Countries[currentQuote].author}</p>
                </div>
              </div>
            </div>
            <div className='home-hopes-section'>
            <div className='home-images-container'>
            <div className='bogor-pictures'/>
              </div>
              <p className='home-indonesia'>Hopes to Our City</p>
              <div className='home-indonesia-text-container'>
                <div className='home-indonesia-text-quote'>
                <p>{Countries[currentQuote].text}</p>
                </div>
                <div className='home-indonesia-text-owner'>
                  <p>-{Countries[currentQuote].author}</p>
                </div>
              </div>
            </div>
            <div className='home-hopes-section'>
            <div className='home-images-container'>
            <div className='future-pictures'/>
              </div>
              <p className='home-indonesia'>Everything to Our Future</p>
              <div className='home-indonesia-text-container'>
                <div className='home-indonesia-text-quote'>
                <p>{Countries[currentQuote].text}</p>
                </div>
                <div className='home-indonesia-text-owner'> 
                  <p>-{Countries[currentQuote].author}</p>
                </div>
              </div>
            </div>
            
            <div className='home-container-2'>

              <div className='home-another'>
                <div className='home-another-card'>
                  <div className='w-full h-full p-5 flex justify-center relative'>
                  <p className='absolute left-3 top-2'>"</p>
                  <div className='p-3 flex justify-center items-center home-card-text'>
                  <TypeAnimation
                      sequence={[
                        'In our abilities, we find our unwavering faith.',
                        5000, 
                        'In our convictions, we discover steadfast belief.',
                        5000,
                        'In our future, we place unconditional trust.',
                        5000,
                        'In our divine, we place our sacred faith.',
                        5000,
                        'In ourselves, we find our true confidence.',
                        5000
                      ]}
                      wrapper="span"
                      speed={30}
                      style={{ fontSize: '1em', display: 'inline-block', fontFamily:'Hedvig Letters Serif'}}
                      repeat={Infinity}
                    />
                  </div>
                  <p className='absolute right-3 bottom-2'>"</p>
                  </div>

                </div>
              </div>

                      <div className='home-teams'>
                        <p className='text-center text-[1.8rem] '>
                          Our Team
                          </p>
                        <div className='home-teams-container'>
                          <div className='home-teams-card-container'>

                            <div className='home-teams-card 1 border-2 border-black'>
                            <div className='home-teams-card-text1'>
                                  <p>K</p> 
                                    <span class="arcticons--emoji-black-spade-suit"></span>
                              </div>
                              <div className='home-teams-card-text2'>
                                    <span class="arcticons--emoji-black-spade-suit-mid"></span>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>K</p> 
                                    <span class="arcticons--emoji-black-spade-suit"></span>
                              </div>
                            </div>

                            <div className='home-teams-card 2 border-2 border-black '>
                            <div className='home-teams-card-text1'>
                                  <p>K</p> 
                                    <span class="arcticons--emoji-black-spade-suit"></span>
                              </div>
                              <div className='home-teams-card-text2'>
                                    <span class="arcticons--emoji-black-spade-suit-mid"></span>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>K</p> 
                                    <span class="arcticons--emoji-black-spade-suit"></span>
                              </div>
                            </div>

                            <div className='home-teams-card 3 border-2 border-black'>
                            <div className='home-teams-card-text1'>
                                  <p>K</p> 
                                  <span class="arcticons--emoji-black-spade-suit"></span>
                                  </div>
                              <div className='home-teams-card-text2'>
                              <span class="arcticons--emoji-black-spade-suit-mid"></span>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>K</p> 
                                  <span class="arcticons--emoji-black-spade-suit"></span>
                                  </div>
                            </div>

                            <div className='home-teams-card 4 border-2 border-black'>
                            <div className='home-teams-card-text1'>
                                  <p>K</p> 
                                  <span class="arcticons--emoji-black-spade-suit"></span>
                                  </div>
                              <div className='home-teams-card-text2'>
                              <span class="arcticons--emoji-black-spade-suit-mid"></span>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>K</p> 
                                  <span class="arcticons--emoji-black-spade-suit"></span>
                                  </div>
                            </div>

                            <div className='home-teams-card 5 border-2 border-black'>
                            <div className='home-teams-card-text1'>
                                  <p>K</p> 
                                    <span class="arcticons--emoji-black-spade-suit"></span>
                              </div>
                              <div className='home-teams-card-text2'>
                                    <span class="arcticons--emoji-black-spade-suit-mid"></span>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>K</p> 
                                    <span class="arcticons--emoji-black-spade-suit"></span>
                              </div>
                            </div>

                            <div className='home-teams-card 6 border-2 border-black'>
                            <div className='home-teams-card-text1'>
                                  <p>J</p> 
                                  <img class="home-diamonds" src={`${process.env.PUBLIC_URL}/assets/diamonds.png`} alt='diamonds'/>
                              </div>
                              <div className='home-teams-card-text2'>
                              <img class="home-diamonds" src={`${process.env.PUBLIC_URL}/assets/diamonds.png`} alt='diamonds'/>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>J</p> 
                                  <img class="home-diamonds" src={`${process.env.PUBLIC_URL}/assets/diamonds.png`} alt='diamonds'/>
                              </div>
                            </div>
                            
                            <div className='home-teams-card 7 border-2 border-black'>
                              <div className='home-teams-card-text1'>
                                  <p>A</p> 
                                  <img class="home-clubs" src={`${process.env.PUBLIC_URL}/assets/clubs.png`} alt='clubs'/>
                              </div>
                              <div className='home-teams-card-text2'>
                              <img class="home-clubs mid" src={`${process.env.PUBLIC_URL}/assets/clubs.png`} alt='clubs'/>
                              </div>
                              <div className='home-teams-card-text3'>
                                  <p>A</p> 
                                  <img class="home-clubs" src={`${process.env.PUBLIC_URL}/assets/clubs.png`} alt='clubs'/>
                              </div>
                            </div>
 
                          </div>

                        </div>
                          

                      </div>



            </div>
          
          </div>
          <div>
            
          </div>


        </div>
      </div>
    </div>
  );
}

export default Home;
