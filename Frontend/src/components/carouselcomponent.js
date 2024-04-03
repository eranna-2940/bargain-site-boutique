import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

import womendesktop from "../images/women-desktop22.jpg"
import kidsdesktop from "../images/kids-desktop111.jpg";
import jewellerydesktop from "../images/jewellery-desktop1.jpg";
import booksdesktop from "../images/books-desktop111.jpg";
import womenmobile from "../images/women-mobile444.jpg";
import womentablet from "../images/women-tablet111.jpg";
import kidsmobile from "../images/kids-mobile22.jpg";
import kidstablet from "../images/kids-tablet.jpg";
import jewellerymobile from "../images/jewellery-mobile2.jpg";
import jewellerytablet from "../images/jewellery-tablet1.jpg";
import booksmobile from "../images/books-mobile1.jpg";
import bookstablet from "../images/books-tablet.jpg";

function CarouselComponent() {
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 767;
  const isTablet = windowWidth >= 768 && windowWidth <= 1024;
  return (
    <div>
    <Carousel>
    <Carousel.Item>
      <div className='image-container'>
      <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? womenmobile : (isTablet ? womentablet : womendesktop)}
              alt="First slide"
            />
      </div>
      
      <Carousel.Caption>
        <h3 className='bannerHead'>Womens Fashion</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <div className='image-container'>
            <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? kidsmobile : (isTablet ? kidstablet : kidsdesktop)}
              alt="First slide"
            />
      </div>

      <Carousel.Caption>
        <h3 className='bannerHead'>Kids Fashion</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <div className='image-container'>

    <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? jewellerymobile : (isTablet ? jewellerytablet : jewellerydesktop)}
              alt="First slide"
            />
      </div>

      <Carousel.Caption>
        <h3 className='bannerHead'>Jewellery</h3>
       
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <div className='image-container'>

            <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? booksmobile : (isTablet ? bookstablet : booksdesktop)}
              alt="First slide"
            />
      </div>

      <Carousel.Caption>
        <h3 className='bannerHead'>Books Collection</h3>
       
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
  </div>
  )
}

export default CarouselComponent


