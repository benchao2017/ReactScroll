import React from "react";
import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';

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


const IMAGES =
  [{
    src: porfolio01,
    thumbnail: image1,
    thumbnailWidth: 170,
    thumbnailHeight: 130,
    // isSelected: true,
    // caption: "After Rain (Jeshu John - designerspics.com)"
  },
  {
    src: porfolio02,
    thumbnail: image2,
    thumbnailWidth: 170,
    thumbnailHeight: 130,
    // tags: [{ value: "Ocean", title: "Ocean" }, { value: "People", title: "People" }],
    // caption: "Boats (Jeshu John - designerspics.com)"
  }, {
    src: porfolio03,
    thumbnail: image3,
    thumbnailWidth: 170,
    thumbnailHeight: 130
  }, {
    src: porfolio04,
    thumbnail: image4,
    thumbnailWidth: 170,
    thumbnailHeight: 130
  }, {
    src: porfolio05,
    thumbnail: image5,
    thumbnailWidth: 170,
    thumbnailHeight: 130
  }, {
    src: porfolio06,
    thumbnail: image6,
    thumbnailWidth: 170,
    thumbnailHeight: 130
  }, {
    src: porfolio07,
    thumbnail: image7,
    thumbnailWidth: 170,
    thumbnailHeight: 130
  },
  {
    src: porfolio08,
    thumbnail: image8,
    thumbnailWidth: 170,
    thumbnailHeight: 130
  }]

const MyGallery = ({ isOpen, lightboxWillClose }) => {


  return (
    <Gallery backdropClosesModal={true} enableImageSelection={false} images={IMAGES} isOpen={isOpen} lightboxWillClose={lightboxWillClose} />
  )
};


export default MyGallery;
