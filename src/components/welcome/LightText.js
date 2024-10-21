import React from 'react';
import './LightText.css'; 

const LightText = ({ revealEasterEgg }) => {
    return (
        <div className="text-container">
            <p className="kinda">kinda funny if</p>
            <p className="dont-see">
                you don't <span className="garis"><button onClick={revealEasterEgg}>see it</button></span>
            </p>
        </div>
    );
}

export default LightText;
