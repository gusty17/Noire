import "./Hero.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  const handleShopCollection = () => {
    navigate("/collections");
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
      .to(bgRef.current, { yPercent: 15, scale: 1.12, ease: "none" }, 0)
      .to(contentRef.current, { yPercent: -30, opacity: 0, ease: "none" }, 0);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-content" ref={contentRef}>
        <h1>Discover Your Signature Scent</h1>
        <p>Luxury fragrances crafted for every moment. Experience the essence of elegance with NOIRE.</p>
        <button className="btn" onClick={handleShopCollection}>Shop Collection</button>
      </div>
    </section>
  );
}

export default Hero;
