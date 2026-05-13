const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const connectForm = document.querySelector("[data-connect-form]");
const formNote = document.querySelector("[data-form-note]");
const openingLoader = document.querySelector("[data-opening-loader]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeTransition = document.querySelector("[data-theme-transition]");
const hoverVideoCards = document.querySelectorAll("[data-hover-video-card]");
const revealTargets = document.querySelectorAll(
  ".manifesto, .section-intro, .project-card, .split-copy, .craft-panel, .archive-grid article, .about-layout, .skills-band > div, .contact-layout, .connect-form"
);

document.body.classList.add("is-loading");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const savedTheme = localStorage.getItem("rhythm-theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeOpeningLoader = () => {
  if (!openingLoader) {
    document.body.classList.remove("is-loading");
    return;
  }

  openingLoader.classList.add("is-done");
  document.body.classList.remove("is-loading");
  window.setTimeout(() => {
    openingLoader.remove();
  }, 800);
};

const syncThemeToggle = () => {
  if (!themeToggle || !themeLabel) {
    return;
  }

  const isLight = document.body.classList.contains("light-mode");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  themeLabel.textContent = isLight ? "Dark" : "Light";
};

syncThemeToggle();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const shouldBeLight = !document.body.classList.contains("light-mode");

    if (themeTransition && !prefersReducedMotion) {
      themeTransition.className = `theme-transition is-animating ${shouldBeLight ? "to-light" : "to-dark"}`;
      window.setTimeout(() => {
        themeTransition.className = "theme-transition";
      }, 820);
    }

    window.setTimeout(
      () => {
        document.body.classList.toggle("light-mode", shouldBeLight);
        localStorage.setItem("rhythm-theme", shouldBeLight ? "light" : "dark");
        syncThemeToggle();
      },
      prefersReducedMotion ? 0 : 190
    );
  });
}

hoverVideoCards.forEach((card) => {
  const video = card.querySelector("[data-hover-video]");

  if (!video) {
    return;
  }

  const playVideo = () => {
    card.classList.add("is-video-active");
    video.play().catch(() => {
      card.classList.remove("is-video-active");
    });
  };

  const stopVideo = () => {
    card.classList.remove("is-video-active");
    video.pause();
    video.currentTime = 0;
  };

  card.addEventListener("mouseenter", playVideo);
  card.addEventListener("focusin", playVideo);
  card.addEventListener("mouseleave", stopVideo);
  card.addEventListener("focusout", stopVideo);
});

if (prefersReducedMotion) {
  closeOpeningLoader();
} else {
  window.addEventListener("load", () => {
    window.setTimeout(closeOpeningLoader, 2300);
  });

  ["click", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, closeOpeningLoader, { once: true });
  });
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") {
    return;
  }

  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
});

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

revealTargets.forEach((target) => {
  target.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => {
    target.classList.add("is-visible");
  });
}

window.addEventListener(
  "pointermove",
  (event) => {
    document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
  },
  { passive: true }
);

if (connectForm) {
  connectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(connectForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!name || !email) {
      formNote.textContent = "Please add your name and email before submitting.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio connection from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nHi Rhythm,\nI would like to connect with you.`);

    formNote.textContent = "Opening your email app...";
    window.location.href = `mailto:rhythmsidhu70@gmail.com?subject=${subject}&body=${body}`;
  });
}
