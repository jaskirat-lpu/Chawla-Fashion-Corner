//hamburger
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // // carousel

  let currentIndex = 0;

  function showSlides(index) {
      const carousel = document.querySelector('.carousel');
      const items = document.querySelectorAll('.carousel-item');
      if (index >= items.length) {
          currentIndex = 0;
      } else if (index < 0) {
          currentIndex = items.length - 1;
      } else {
          currentIndex = index;
      }
      carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
  }

  function nextSlides() {
      showSlides(currentIndex + 1);
  }

  function prevSlides() {
      showSlides(currentIndex - 1);
  }

// //   // Auto slide every 5 seconds
//   setInterval(nextSlides, 5000);

