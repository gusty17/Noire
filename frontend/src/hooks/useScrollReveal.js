import { useCallback, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Fades + slides an element into view as it enters the viewport while scrolling.
// Pass stagger > 0 to animate the element's direct children individually
// (e.g. cards in a grid) instead of the element as a single block.
export function useScrollReveal({ stagger = 0, y = 40, start = "top 85%" } = {}) {
  const [node, setNode] = useState(null);
  const ref = useCallback((el) => setNode(el), []);

  useEffect(() => {
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger > 0 ? Array.from(node.children) : node;
    if (stagger > 0 && targets.length === 0) return;

    gsap.set(targets, { opacity: 0, y });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      stagger,
      scrollTrigger: {
        trigger: node,
        start,
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [node, stagger, y, start]);

  return ref;
}
