import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * v-reveal directive — fades + slides an element in when it enters the viewport.
 *
 * Usage:
 *   v-reveal                             → defaults (fade up 24px)
 *   v-reveal="{ delay: 0.15, y: 40 }"   → custom options
 *   v-reveal="{ x: -30 }"               → slide in from left
 */
export const vReveal = {
  mounted(el, binding) {
    const { delay = 0, y = 24, x = 0, duration = 0.7 } = binding.value || {};

    // Set initial hidden state immediately so there's no flash
    gsap.set(el, { opacity: 0, y, x });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  },

  unmounted(el) {
    // Clean up ScrollTrigger instances tied to this element
    ScrollTrigger.getAll()
      .filter((t) => t.trigger === el)
      .forEach((t) => t.kill());
  },
};
