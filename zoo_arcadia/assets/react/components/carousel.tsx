import React from 'react';

interface CarouselItem {
  id: string;
  imgSrc: string;
  altText: string;
  title: string;
  description: string;
  className: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  return (
    <div id="carouselAccueil" className="carousel carousel-dark slide">
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button 
            key={index}
            type="button"
            data-bs-target="#carouselAccueil"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img src={item.imgSrc} className={`d-block w-100 h-100 ${item.className}`} alt={item.altText} />
            <div className="container-carousel--text text-center d-flex flex-column align-items-center w-100">
              <h1 className="fw-semibold">{item.title}</h1>
              <h3 className="fw-semibold w-75 px-3 px-lg-5">{item.description}</h3>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselAccueil" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselAccueil" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};


