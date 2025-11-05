const slides = document.querySelectorAll('.slider img');
let i = 0;
setInterval(() => {
  slides[i].classList.remove('active');
  i = (i + 1) % slides.length;
  slides[i].classList.add('active');
}, 5000);
slides[0].classList.add('active');