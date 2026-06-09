document.addEventListener("DOMContentLoaded", () => {
  // Grab ALL carousels on the page
  const tracks = document.querySelectorAll(".carousel-track");

  // Helper function: Calculates scroll distance for a specific track
  const getScrollAmount = (track) => {
    const card = track.querySelector(".carousel-card");
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  // Loop through every single carousel and set it up independently
  tracks.forEach((track) => {
    // 1. Setup the Infinite Illusion on Load
    track.prepend(track.lastElementChild);
    setTimeout(() => {
      track.scrollLeft = getScrollAmount(track);
    }, 0);

    // 2. The Seamless Reset
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

  // 3. Smart Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

    // Find the track the user's mouse is currently hovering over
    let targetTrack = document.querySelector(
      ".carousel-wrapper:hover .carousel-track",
    );

    // If they aren't hovering, just find the first track currently visible on screen
    if (!targetTrack) {
      targetTrack = Array.from(tracks).find((t) => {
        const rect = t.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
    }

    // If we found a track, scroll it!
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

  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn.querySelector("i");

  // 1. Check if they already have a preference saved in their browser
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeIcon.classList.replace("fa-sun", "fa-moon"); // Change icon to moon
  }

  // 2. Listen for the click
  themeToggleBtn.addEventListener("click", () => {
    // Toggle the class on the body
    document.body.classList.toggle("light-mode");

    // Check if light mode is now active
    if (document.body.classList.contains("light-mode")) {
      // Save preference and switch icon to Moon (suggesting dark mode is the alternative)
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      // Revert preference and switch icon back to Sun
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  });
}); // <-- THIS is the single, correct closing bracket for DOMContentLoaded
