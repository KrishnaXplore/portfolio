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
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Update UI to sending state
      submitBtn.textContent = "Sending...";
      submitBtn.style.opacity = "0.7";
      submitBtn.style.pointerEvents = "none";

      const formData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        project_type: document.getElementById("projectType").value,
        message: document.getElementById("message").value,
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        // First, check if the request was successful
        if (!response.ok) {
          let errorMessage = `Submission failed (${response.status})`;
          
          try {
            // Attempt to get JSON error message if available
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // If response is not JSON (e.g. 404 HTML page), use status text
            errorMessage = `API Error: ${response.statusText || 'Endpoint not found'}`;
            if (response.status === 404) {
              errorMessage = "API endpoint not found. Please ensure you are running 'vercel dev' or have deployed the functions.";
            }
          }
          throw new Error(errorMessage);
        }

        // Now, verify the content type before parsing JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid response format (Expected JSON)');
        }

        const result = await response.json();

        if (response.ok) {
          // Show success message with animation
          if (successMessage) {
            successMessage.innerHTML = "<p>Message received. I'll get back to you soon.</p>";
            successMessage.classList.add("show");
            gsap.from(successMessage, {
              y: 15,
              opacity: 0,
              duration: 0.5,
              ease: "power3.out",
            });
          }
          form.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            successMessage.classList.remove("show");
          }, 5000);
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Submission error:', error);
        if (successMessage) {
          successMessage.innerHTML = `<p style="color: #ff4d4d; font-size: 0.8rem;">${error.message}</p>`;
          successMessage.classList.add("show");
        }
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.style.opacity = "1";
        submitBtn.style.pointerEvents = "all";
      }
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