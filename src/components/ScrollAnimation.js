import React from "react";

import "../ScrollAnimation.css";

const ScrollAnimation = () => {
  return (
    <div className="scroll-animation">
      <div className="container-scroll">
        <div className="chevron"></div>
        <div className="chevron"></div>
        <div className="chevron"></div>
        <span className="text">Scroll down</span>
      </div>
    </div>
  );
};

export default ScrollAnimation;
