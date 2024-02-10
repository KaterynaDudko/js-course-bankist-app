'use strict';
///////////////////////////////////////
//ELEMENTS

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const imgTarget = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');

///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function () {
  const section1Coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: section1Coords.left + window.scrollX,
  //   top: section1Coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

//Add event listener to common parent element for the effitiency
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //e.target - where event actually occured

  //ignore clicking on parent element
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Not effitient if there are a lot of elements

// document.querySelectorAll('.nav__link').forEach(function (e) {
//   e.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

///////////////////////////////////////
//Tab component
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );

  //Add active clases
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu animation
const handleMenuFade = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(sibl => {
      if (sibl !== clicked) sibl.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleMenuFade.bind(0.5));

nav.addEventListener('mouseout', handleMenuFade.bind(1));

//Sticky navigation
const navHeigth = nav.getBoundingClientRect().height;

//every time observer intersects with observer.observe(element) this function will be called
const stickyNavigation = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const observerOptions = {
  root: null, //viewport
  //treshhold: [0, 0.2], // 0 - when target moves completely out of/into the root
  treshhold: 0,
  rootMargin: `-${navHeigth}px`,
};

const headerObserver = new IntersectionObserver(
  stickyNavigation,
  observerOptions
);
headerObserver.observe(header);

//Reveal sections smoothly

const revealSections = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  treshhold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images

const loadImages = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  treshhold: 0,
  rootMargin: `200px`,
});
imgTarget.forEach(img => imagesObserver.observe(img));

//Create slider
let currSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

//init slider
goToSlide(0);

const nextSLide = function () {
  currSlide = currSlide === maxSlide - 1 ? 0 : ++currSlide;
  goToSlide(currSlide);
};
const prevSlide = function () {
  currSlide = currSlide === 0 ? maxSlide - 1 : --currSlide;
  goToSlide(currSlide);
};

sliderBtnRight.addEventListener('click', nextSLide);
sliderBtnLeft.addEventListener('click', prevSlide);
