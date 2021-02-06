import React from "react";

import image1 from "../Archive/buttonSML01.png";
import image2 from "../Archive/buttonSML02.png";
import image3 from "../Archive/buttonSML03.png";
import image4 from "../Archive/buttonSML04.png";
import image5 from "../Archive/buttonSML05.png";
import image6 from "../Archive/buttonSML06.png";
import image7 from "../Archive/buttonSML07.png";
import image8 from "../Archive/buttonSML08.png";

import "../Gallery.css";

const Gallery = () => {
  return (
    <div className="gallery">
      <img src={image1} alt="gallery1"></img>
      <img src={image2} alt="gallery2"></img>
      <img src={image3} alt="gallery3"></img>
      <img src={image4} alt="gallery4"></img>
      <img src={image5} alt="gallery5"></img>
      <img src={image6} alt="gallery6"></img>
      <img src={image7} alt="gallery7"></img>
      <img src={image8} alt="gallery8"></img>
    </div>
  );
};

export default Gallery;
