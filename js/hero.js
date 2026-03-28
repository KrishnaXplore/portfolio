// hero.js

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  const shatterContainer = document.querySelector(".hero-img");
  const mainImg = shatterContainer.querySelector("img");
  let currentImageIndex = 1;
  const totalImages = 5;
  let scrollTriggerInstance1 = null;
  let scrollTriggerInstance2 = null;

  // -- SHATTER PHYSICS SETUP --
  const shards = [];
  const xDivs = 5;
  const yDivs = 5;
  const points = [];

  for (let y = 0; y <= yDivs; y++) {
    const row = [];
    for (let x = 0; x <= xDivs; x++) {
      let px = (x / xDivs) * 100;
      let py = (y / yDivs) * 100;
      if (x > 0 && x < xDivs && y > 0 && y < yDivs) {
        px += (Math.random() - 0.5) * 15; // Jitter to make shards irregular
        py += (Math.random() - 0.5) * 15;
      }
      row.push({ x: px, y: py });
    }
    points.push(row);
  }

  for (let y = 0; y < yDivs; y++) {
    for (let x = 0; x < xDivs; x++) {
      const tl = points[y][x];
      const tr = points[y][x+1];
      const br = points[y+1][x+1];
      const bl = points[y+1][x];
      
      const createShard = (polygon, cx, cy) => {
        const shard = document.createElement("div");
        shard.className = "glass-shard";
        shard.style.position = "absolute";
        shard.style.top = "0";
        shard.style.left = "0";
        shard.style.width = "100%";
        shard.style.height = "100%";
        shard.style.backgroundImage = `url('/images/hero/img${currentImageIndex}.jpg')`;
        shard.style.backgroundSize = "cover";
        shard.style.backgroundPosition = "center";
        shard.style.clipPath = polygon;
        shard.style.opacity = "0";
        shard.style.zIndex = "2";
        shard.style.willChange = "transform, opacity";
        
        const dirX = (cx - 50);
        const dirY = (cy - 50);
        const force = 15 + Math.random() * 30;
        
        shard.dataset.vx = dirX * force;
        shard.dataset.vy = dirY * force - (Math.random() * 400); // Popup effect
        shard.dataset.vrX = (Math.random() - 0.5) * 1200;
        shard.dataset.vrY = (Math.random() - 0.5) * 1200;
        shard.dataset.vrZ = (Math.random() - 0.5) * 720;
        
        shatterContainer.appendChild(shard);
        shards.push(shard);
      };
      
      createShard(`polygon(${tl.x}% ${tl.y}%, ${tr.x}% ${tr.y}%, ${bl.x}% ${bl.y}%)`, (tl.x+tr.x+bl.x)/3, (tl.y+tr.y+bl.y)/3);
      createShard(`polygon(${tr.x}% ${tr.y}%, ${br.x}% ${br.y}%, ${bl.x}% ${bl.y}%)`, (tr.x+br.x+bl.x)/3, (tr.y+br.y+bl.y)/3);
    }
  }

  setInterval(() => {
    currentImageIndex = currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
    const newBg = `/images/hero/img${currentImageIndex}.jpg`;
    mainImg.src = newBg;
    shards.forEach(shard => {
      shard.style.backgroundImage = `url('${newBg}')`;
    });
  }, 250);

  window.forceHeroShatter = () => {
    if (scrollTriggerInstance1) scrollTriggerInstance1.disable();
    if (scrollTriggerInstance2) scrollTriggerInstance2.disable();

    const mainImg = document.querySelector(".hero-img img");
    const shatterContainer = document.querySelector(".hero-img-shatter-container");
    
    gsap.set(mainImg, { opacity: 0 });
    gsap.to(shatterContainer, { borderColor: "rgba(240, 240, 240, 0)", duration: 0.5 });
    gsap.set(shards, { opacity: 1 });

    shards.forEach(shard => {
      const vx = parseFloat(shard.dataset.vx);
      const vy = parseFloat(shard.dataset.vy);
      const vrX = parseFloat(shard.dataset.vrX);
      const vrY = parseFloat(shard.dataset.vrY);
      const vrZ = parseFloat(shard.dataset.vrZ);
      
      gsap.to(shard, {
        x: vx,
        y: vy + 3000,
        rotationX: vrX,
        rotationY: vrY,
        rotationZ: vrZ,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      });
    });
  };

  const initAnimations = () => {
    if (scrollTriggerInstance1) scrollTriggerInstance1.kill();
    if (scrollTriggerInstance2) scrollTriggerInstance2.kill();

    scrollTriggerInstance1 = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`,
          scale: 0.25 + 0.75 * progress,
          rotation: -15 + 15 * progress,
        });
      },
    });

    scrollTriggerInstance2 = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: false,
      onUpdate: (self) => {
        const p = self.progress;
        if (p > 0.001) {
          gsap.set(mainImg, { opacity: 0 });
          gsap.set(shatterContainer, { 
            borderColor: `rgba(240, 240, 240, ${Math.max(0, 1 - p * 15)})`
          });
          gsap.set(shards, { opacity: 1 });
          
          shards.forEach(shard => {
            const vx = parseFloat(shard.dataset.vx);
            const vy = parseFloat(shard.dataset.vy);
            const vrX = parseFloat(shard.dataset.vrX);
            const vrY = parseFloat(shard.dataset.vrY);
            const vrZ = parseFloat(shard.dataset.vrZ);
            
            gsap.set(shard, {
              x: vx * p,
              y: vy * p + (3000 * Math.pow(p, 2)),
              rotationX: vrX * p,
              rotationY: vrY * p,
              rotationZ: vrZ * p,
              opacity: 1 - Math.pow(p, 2),
            });
          });
        } else if (p === 0) {
          gsap.set(mainImg, { opacity: 1 });
          gsap.set(shatterContainer, { borderColor: "var(--fg)" });
          gsap.set(shards, { opacity: 0, x: 0, y: 0, rotationX: 0, rotationY: 0, rotationZ: 0 });
        }
      },
    });
  };

  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
    ScrollTrigger.refresh();
  });
});