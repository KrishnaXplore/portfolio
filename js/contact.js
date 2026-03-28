// contact.js - Contact page animations with GSAP (no emailjs)

import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const isContactPage = document.querySelector(".page.contact-page");
  if (!isContactPage) return;

  // Create floating elements
  const floatingContainer = document.querySelector(".floating-elements");
  if (floatingContainer) {
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.className = "floating-element";
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDelay = `${Math.random() * 12}s`;
      el.style.animationDuration = `${8 + Math.random() * 8}s`;
      floatingContainer.appendChild(el);
    }
  }

  // Entrance animations for contact page
  const tl = gsap.timeline({ delay: 0.5 });

  tl.from(".contact-card-header-main h1", {
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: "power4.out",
  })
  .from(".contact-card-header-main p", {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out",
  }, "-=0.4")
  .from(".contact-info-item", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power3.out",
  }, "-=0.3")
  .from(".contact-form-container", {
    y: 40,
    opacity: 0,
    scale: 0.98,
    duration: 0.8,
    ease: "power3.out",
  }, "-=0.4");

  // Form submission handler (mailto fallback)
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const projectType = document.getElementById("projectType").value;
      const message = document.getElementById("message").value;

      const subject = encodeURIComponent(`${projectType} - ${firstName} ${lastName}`);
      const body = encodeURIComponent(
        `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nInquiry Type: ${projectType}\n\nMessage:\n${message}`
      );

      window.open(`mailto:dixitatharvv@gmail.com?subject=${subject}&body=${body}`, "_blank");

      // Show success message with animation
      if (successMessage) {
        successMessage.classList.add("show");
        gsap.from(successMessage, {
          y: 15,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      }

      form.reset();
    });
  }

  // Image trail effect on mouse move (contact page)
  const trailContainer = document.querySelector(".trail-container");
  if (trailContainer && window.innerWidth > 1000) {
    const images = [
      "/images/work-items/work-item-1.jpg",
      "/images/work-items/work-item-2.jpg",
      "/images/work-items/work-item-3.jpg",
      "/images/work-items/work-item-4.jpg",
    ];

    let trailIndex = 0;
    let lastTrailTime = 0;
    const trailDelay = 150;

    trailContainer.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastTrailTime < trailDelay) return;
      lastTrailTime = now;

      const img = document.createElement("img");
      img.src = images[trailIndex % images.length];
      img.className = "trail-img";
      img.style.left = `${e.clientX - 60}px`;
      img.style.top = `${e.clientY - 60}px`;
      trailContainer.appendChild(img);
      trailIndex++;

      gsap.fromTo(img, 
        { scale: 0, rotation: Math.random() * 20 - 10, opacity: 1 },
        {
          scale: 1,
          rotation: Math.random() * 30 - 15,
          duration: 0.4,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(img, {
              opacity: 0,
              scale: 0.5,
              y: 30,
              duration: 0.6,
              delay: 0.3,
              ease: "power2.in",
              onComplete: () => img.remove(),
            });
          },
        }
      );
    });
  }
});