document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. THEME TOGGLE LOGIC
  // ==========================================
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn.querySelector("i");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  });

  // ==========================================
  // 2. DYNAMIC CURSOR GLOW (GPU ACCELERATED)
  // ==========================================
  const cursorGlow = document.createElement("div");
  cursorGlow.classList.add("cursor-glow");
  document.body.appendChild(cursorGlow);

  document.addEventListener("mousemove", (e) => {
    // Subtracting 190px centers the 380px glow exactly on the mouse pointer
    cursorGlow.style.transform = `translate(${e.clientX - 190}px, ${e.clientY - 190}px)`;
  });

  // ==========================================
  // 3. SCROLL FADE-IN ANIMATIONS
  // ==========================================
  const fadeElements = document.querySelectorAll(
    ".project-item, .experience-item, .course-card, .hobby-section",
  );
  fadeElements.forEach((el) => el.classList.add("fade-in"));

  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing once faded in
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // ==========================================
  // 4. ACTIVE NAVIGATION UNDERLINE TRACKING
  // ==========================================
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navigation-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((sec) => navObserver.observe(sec));

  // ==========================================
  // 5. INFINITE CAROUSEL LOGIC
  // ==========================================
  const tracks = document.querySelectorAll(".carousel-track");

  const getScrollAmount = (track) => {
    const card = track.querySelector(".carousel-card");
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  tracks.forEach((track) => {
    track.prepend(track.lastElementChild);
    setTimeout(() => {
      track.scrollLeft = getScrollAmount(track);
    }, 0);

    let scrollTimeout;
    track.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollAmt = getScrollAmount(track);

        if (track.scrollLeft < scrollAmt / 2) {
          track.classList.add("no-transition");
          track.prepend(track.lastElementChild);
          track.scrollLeft += scrollAmt;
          void track.offsetWidth;
          track.classList.remove("no-transition");
        } else if (
          track.scrollLeft >
          track.scrollWidth - track.clientWidth - scrollAmt / 2
        ) {
          track.classList.add("no-transition");
          track.appendChild(track.firstElementChild);
          track.scrollLeft -= scrollAmt;
          void track.offsetWidth;
          track.classList.remove("no-transition");
        }
      }, 150);
    });
  });

  // Carousel Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

    let targetTrack = document.querySelector(
      ".carousel-wrapper:hover .carousel-track",
    );

    if (!targetTrack) {
      targetTrack = Array.from(tracks).find((t) => {
        const rect = t.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
    }

    if (targetTrack) {
      e.preventDefault();
      const scrollAmt = getScrollAmount(targetTrack);
      if (e.key === "ArrowRight") {
        targetTrack.scrollBy({ left: scrollAmt, behavior: "smooth" });
      } else {
        targetTrack.scrollBy({ left: -scrollAmt, behavior: "smooth" });
      }
    }
  });

  // ==========================================
  // 6. DYNAMIC FOOTER YEAR
  // ==========================================
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ==========================================
  // 7. SMART NAVIGATION (HIDE ON SCROLL DOWN)
  // ==========================================
  let lastScrollY = window.scrollY;
  const navBar = document.querySelector(".navigation");

  window.addEventListener("scroll", () => {
    // Safari rubber-band fix: prevents the menu from glitching at the absolute top
    if (window.scrollY <= 0) {
      navBar.classList.remove("nav-hidden");
      return;
    }

    // If scrolling down AND past the top 60px, hide it
    if (window.scrollY > lastScrollY && window.scrollY > 60) {
      navBar.classList.add("nav-hidden");
    } else {
      // If scrolling up, show it immediately
      navBar.classList.remove("nav-hidden");
    }
    lastScrollY = window.scrollY;
  });

  // ==========================================
  // 8. TERMINAL TYPING EFFECT (JS POWERED)
  // ==========================================
  const textToType = "Software Engineer";
  const typeElement = document.querySelector(".title-sub");
  
  if (typeElement) {
    typeElement.textContent = ""; // Clear the element just in case
    
    let charIndex = 0;
    
    // Wait for the CSS heroFadeIn to finish (approx 1300ms) before typing
    setTimeout(() => {
      const typeWriterInterval = setInterval(() => {
        if (charIndex < textToType.length) {
          typeElement.textContent += textToType.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeWriterInterval); // Stop the interval when done
        }
      }, 90); // 90ms per letter feels like a natural typing speed
    }, 1300);
  }
});
