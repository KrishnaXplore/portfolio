// cursor.js - Custom cursor follower with GSAP

import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  // Only enable custom cursor on desktop
  if (window.innerWidth <= 1000) return;

  const follower = document.querySelector(".cursor-follower");
  const dot = document.querySelector(".cursor-dot");

  if (!follower || !dot) return;

  let mouseX = 0;
  let mouseY = 0;

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    gsap.set(dot, {
      x: mouseX,
      y: mouseY,
    });
  });

  // Follower follows with smooth delay
  gsap.ticker.add(() => {
    gsap.to(follower, {
      x: mouseX,
      y: mouseY,
      duration: 0.6,
      ease: "power3.out",
    });
  });

  // Hover states for interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .menu-toggle-btn, .logo, .magnetic-wrap, .nav-item, .contact-button"
  );

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      follower.classList.add("cursor-hover");
    });
    target.addEventListener("mouseleave", () => {
      follower.classList.remove("cursor-hover");
    });
  });

  // Text cursor for inputs/textareas
  const textTargets = document.querySelectorAll("input, textarea, select");
  textTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      follower.classList.add("cursor-text");
    });
    target.addEventListener("mouseleave", () => {
      follower.classList.remove("cursor-text");
    });
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    gsap.to([follower, dot], {
      opacity: 0,
      duration: 0.3,
    });
  });

  document.addEventListener("mouseenter", () => {
    gsap.to([follower, dot], {
      opacity: 1,
      duration: 0.3,
    });
  });
});
