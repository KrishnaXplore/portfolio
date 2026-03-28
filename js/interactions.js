// interactions.js - Magnetic hover, text split reveal, tilt cards

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ===== MAGNETIC HOVER EFFECT =====
  // Subtle pull toward cursor on hoverable elements
  if (window.innerWidth > 1000) {
    const magneticElements = document.querySelectorAll(".magnetic-wrap");

    magneticElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  }

  // ===== TEXT SPLIT REVEAL =====
  // Animate heading letters on scroll
  const splitTexts = document.querySelectorAll(".split-text");

  splitTexts.forEach((text) => {
    const content = text.textContent;
    text.innerHTML = "";

    // Wrap each character in a span
    for (let i = 0; i < content.length; i++) {
      const span = document.createElement("span");
      span.className = "split-char";
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.textContent = content[i] === " " ? "\u00A0" : content[i];
      text.appendChild(span);
    }

    const chars = text.querySelectorAll(".split-char");

    // Set initial state
    gsap.set(chars, {
      y: 80,
      opacity: 0,
      rotateX: -40,
    });

    // Animate on scroll
    ScrollTrigger.create({
      trigger: text,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power4.out",
        });
      },
    });
  });

  // ===== TILT CARD EFFECT =====
  // 3D perspective shift on service cards on mousemove
  if (window.innerWidth > 1000) {
    const tiltCards = document.querySelectorAll(".tilt-card .service-card-inner");

    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  }

  // ===== SCROLL REVEAL ANIMATIONS =====
  // Fade-in elements as they enter viewport
  const revealElements = document.querySelectorAll(
    ".about-hero-bio, .experience-header, .roadmap-item, .featured-title-wrapper, .services-header-content, .service-card, .contact-cta .contact-button, .footer-header, .footer-row, .contact-left, .contact-form-container"
  );

  revealElements.forEach((el) => {
    gsap.set(el, {
      y: 40,
      opacity: 0,
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        });
      },
    });
  });

  // ===== PARALLAX ON PORTRAIT =====
  // Enhance existing portrait parallax with subtle scale
  const portrait = document.querySelector(".about-hero-portrait");
  if (portrait) {
    ScrollTrigger.create({
        trigger: ".about-hero",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const scale = 1 + self.progress * 0.1;
          gsap.set(portrait, {
            scale: scale,
          });
        },
      });
    }

  // ===== NAV ITEM HOVER ANIMATIONS =====
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Global fix: Refresh all ScrollTrigger calculations after all assets heavily load
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});
