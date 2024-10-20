import React from 'react';
import './LightText.css'; 

const LightText = () => {
    return (
        <div className="text-container">
            <p className="kinda">kinda funny if</p>
            <p className="dont-see">
                you don't <span className="garis"><button>see it</button></span>
            </p>
        </div>
    );
}

export default LightText;
