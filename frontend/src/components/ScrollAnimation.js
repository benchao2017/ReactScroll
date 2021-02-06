import React from "react";

import "../ScrollAnimation.css";

const ScrollAnimation = () => {
  return (
    <div className="scroll-animation">
      <div class="container">
        <div class="chevron"></div>
        <div class="chevron"></div>
        <div class="chevron"></div>
        <span class="text">Scroll down</span>
      </div>
    </div>
  );
};

export default ScrollAnimation;
