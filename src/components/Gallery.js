import React from "react";

import image1 from "../Archive/buttonSML01.png";
import image2 from "../Archive/buttonSML02.png";
import image3 from "../Archive/buttonSML03.png";
import image4 from "../Archive/buttonSML04.png";
import image5 from "../Archive/buttonSML05.png";
import image6 from "../Archive/buttonSML06.png";
import image7 from "../Archive/buttonSML07.png";
import image8 from "../Archive/buttonSML08.png";
import porfolio01 from "../Archive/porfolio01.png";
import porfolio02 from "../Archive/porfolio02.png";
import porfolio03 from "../Archive/porfolio03.png";
import porfolio04 from "../Archive/porfolio04.png";
import porfolio05 from "../Archive/porfolio05.png";
import porfolio06 from "../Archive/porfolio06.png";
import porfolio07 from "../Archive/porfolio07.png";
import porfolio08 from "../Archive/porfolio08.png";
import "../Gallery.css";

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

import { Gallery, Item } from 'react-photoswipe-gallery'

const MyGallery = () => (
  
  <Gallery>
    <Item
      original={porfolio01}
      thumbnail={porfolio01}
      width="1024"
      height="1024"
    >
      {({ ref, open }) => (
        <img ref={ref} onClick={open} src={image1} />
      )}
    </Item>
    <Item
      original={porfolio02}
      thumbnail={image2}
      width="1024"
      height="1024"
    >
      {({ ref, open }) => (
        <img ref={ref} onClick={open} src={image2} />
      )}
    </Item>
    <Item
      original={porfolio03}
      thumbnail={image3}
      width="1024"
      height="1024"
    >
      {({ ref, open }) => (
        <img ref={ref} onClick={open} src={image3} />
      )}
    </Item>
    <Item
      original={porfolio04}
      thumbnail={image4}
      width="1024"
      height="1024"
    >
      {({ ref, open }) => (
        <img ref={ref} onClick={open} src={image4} />
      )}
    </Item>
    <Item
      original={porfolio05}
      thumbnail={image5}
      width="1024"
      height="1024"
    >
      {({ ref, open }) => (
        <img ref={ref} onClick={open} src={image5} />
      )}
    </Item>
    <Item
      original={porfolio06}
      thumbnail={image6}
      width="1024"
      height="1024"
    >
      {({ ref, open }) => (
        <img ref={ref} onClick={open} src={image6} />
      )}
    </Item>
     <Item
     original={porfolio07}
     thumbnail={image7}
     width="1024"
     height="1024"
   >
     {({ ref, open }) => (
       <img ref={ref} onClick={open} src={image7} />
     )}
   </Item>
    <Item
    original={porfolio08}
    thumbnail={image8}
    width="1024"
    height="1024"
  >
    {({ ref, open }) => (
      <img ref={ref} onClick={open} src={image8} />
    )}
  </Item>
  </Gallery>
)

/* const Gallery = () => {
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
}; */

export default MyGallery;
