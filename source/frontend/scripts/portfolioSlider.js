const sliderSettings = {
    arrows: false,
    cssEase: 'linear',
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          fade: false,
        }
      }
    ]
}

const leftArrowApps = $('.slider-article.app-projects-slider .fa-chevron-circle-left');
const rightArrowApps = $('.slider-article.app-projects-slider .fa-chevron-circle-right');
const leftArrowBml = $('.slider-article.bml-projects-slider .fa-chevron-circle-left');
const rightArrowBml = $('.slider-article.bml-projects-slider .fa-chevron-circle-right');
const portfolioSliderApps = $('.portfolio-slider.app-projects');
const portfolioSliderBml = $('.portfolio-slider.bml-projects');

$(document).ready(() => {
    //init slider
    portfolioSliderApps.slick(sliderSettings);
    portfolioSliderBml.slick(sliderSettings);

    //leveraging slick methods
    //custom next slide event
    rightArrowApps.click(() => {
      portfolioSliderApps.slick('slickNext');
    });
    //custom prev slide event
    leftArrowApps.click(() => {
      portfolioSliderApps.slick('slickPrev');
    });
    rightArrowBml.click(() => {
      portfolioSliderBml.slick('slickNext');
    });
    //custom prev slide event
    leftArrowBml.click(() => {
      portfolioSliderBml.slick('slickPrev');
    });
});
