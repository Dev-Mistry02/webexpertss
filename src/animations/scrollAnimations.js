import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = () => {
  // --------------------------------
  // SECTION REVEAL
  // --------------------------------

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.fromTo(
      element,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // --------------------------------
  // TEXT REVEAL
  // --------------------------------

  gsap.utils.toArray(".text-reveal").forEach((element) => {
    gsap.fromTo(
      element,
      {
        y: "100%",
      },
      {
        y: "0%",
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
      }
    );
  });

  // --------------------------------
  // IMAGE PARALLAX
  // --------------------------------

  gsap.utils.toArray(".parallax-image").forEach((image) => {
    gsap.to(image, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // --------------------------------
  // IMAGE SCALE
  // --------------------------------

  gsap.utils.toArray(".scale-image").forEach((image) => {
    gsap.fromTo(
      image,
      {
        scale: 1.2,
      },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top 90%",
          end: "bottom 20%",
          scrub: true,
        },
      }
    );
  });

  // --------------------------------
  // ROTATION
  // --------------------------------

  gsap.utils.toArray(".rotate-scroll").forEach((element) => {
    gsap.to(element, {
      rotation: 360,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
};