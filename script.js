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
  // 5. INFINITE CAROUSEL LOGIC (The "Silent Jump" Architecture)
  // ==========================================
  const tracks = document.querySelectorAll(".carousel-track");

  tracks.forEach((track) => {
    // 1. Grab current cards. Your HTML has 6 cards (3 unique, repeated). 
    // We slice the array in half so we just have the 3 unique ones.
    const allCards = Array.from(track.querySelectorAll(".carousel-card"));
    const uniqueCards = allCards.slice(0, Math.ceil(allCards.length / 2));

    // 2. Clear the track to rebuild it programmatically
    track.innerHTML = "";

    // 3. Build 3 identical sets: [Left Buffer] [Center Active] [Right Buffer]
    // This ensures the user never hits a wall while swiping quickly.
    for (let i = 0; i < 3; i++) {
      uniqueCards.forEach((card) => {
        track.appendChild(card.cloneNode(true));
      });
    }

    // 4. Calculate the width of exactly one "set" of unique cards
    const getSetWidth = () => {
      const card = track.querySelector(".carousel-card");
      const gap = parseInt(window.getComputedStyle(track).gap) || 0;
      return (card.offsetWidth + gap) * uniqueCards.length;
    };

    // 5. Start the user seamlessly in the middle set
    setTimeout(() => {
      track.scrollLeft = getSetWidth();
    }, 50);

    // 6. The "Silent Jump" scroll logic
    let scrollTimeout;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);

      // Wait 150ms for the swipe momentum to completely die before acting
      scrollTimeout = setTimeout(() => {
        const setWidth = getSetWidth();
        const currentScroll = track.scrollLeft;

        // If user drifted into the Left Buffer, invisibly teleport to the Center
        if (currentScroll < setWidth - 10) {
          track.style.scrollSnapType = "none";
          track.scrollLeft = currentScroll + setWidth;
          track.offsetHeight; // Force browser to process the jump instantly
          track.style.scrollSnapType = "x mandatory";
        }
        // If user drifted into the Right Buffer, invisibly teleport back to Center
        else if (currentScroll >= setWidth * 2 - 10) {
          track.style.scrollSnapType = "none";
          track.scrollLeft = currentScroll - setWidth;
          track.offsetHeight; 
          track.style.scrollSnapType = "x mandatory";
        }
      }, 150);
    });
  });

  // Carousel Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

    let targetTrack = document.querySelector(".carousel-wrapper:hover .carousel-track");
    
    if (!targetTrack) {
      targetTrack = Array.from(tracks).find((t) => {
        const rect = t.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
    }

    if (targetTrack) {
      e.preventDefault();
      const card = targetTrack.querySelector(".carousel-card");
      const gap = parseInt(window.getComputedStyle(targetTrack).gap) || 0;
      const scrollAmt = card.offsetWidth + gap;
      
      // We manually declare smooth behavior here so keys still slide smoothly
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
