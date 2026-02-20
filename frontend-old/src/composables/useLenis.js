import Lenis from '@studio-freight/lenis';

let lenis = null;

export function useLenis() {
  const initLenis = () => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  };

  const scrollTo = (target, options = {}) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  };

  const destroy = () => {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  };

  return {
    lenis,
    initLenis,
    scrollTo,
    destroy,
  };
}
