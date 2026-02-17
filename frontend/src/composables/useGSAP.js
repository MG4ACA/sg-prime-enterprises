import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGSAP() {
  // Fade in animation
  const fadeIn = (element, options = {}) => {
    return gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: options.y || 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.8,
        ease: options.ease || 'power3.out',
        delay: options.delay || 0
      }
    )
  }

  // Stagger animation for multiple elements
  const staggerIn = (elements, options = {}) => {
    return gsap.fromTo(
      elements,
      { 
        opacity: 0, 
        y: options.y || 50 
      },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.6,
        stagger: options.stagger || 0.1,
        ease: options.ease || 'power2.out',
        scrollTrigger: options.scrollTrigger || null
      }
    )
  }

  // Parallax effect
  const parallax = (element, options = {}) => {
    return gsap.to(element, {
      y: options.distance || -50,
      ease: 'none',
      scrollTrigger: {
        trigger: options.trigger || element,
        start: options.start || 'top bottom',
        end: options.end || 'bottom top',
        scrub: options.scrub !== undefined ? options.scrub : true,
        ...options.scrollTrigger
      }
    })
  }

  // Scale on scroll
  const scaleOnScroll = (element, options = {}) => {
    return gsap.fromTo(
      element,
      { scale: options.from || 0.8 },
      {
        scale: options.to || 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: options.trigger || element,
          start: options.start || 'top 80%',
          end: options.end || 'top 30%',
          scrub: options.scrub !== undefined ? options.scrub : 1,
          ...options.scrollTrigger
        }
      }
    )
  }

  // Background color transition
  const colorTransition = (element, colors = [], options = {}) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: options.trigger || element,
        start: options.start || 'top center',
        end: options.end || 'bottom center',
        scrub: options.scrub !== undefined ? options.scrub : 1,
        ...options.scrollTrigger
      }
    })

    colors.forEach((color, index) => {
      tl.to(element, {
        backgroundColor: color,
        duration: 1,
      }, index)
    })

    return tl
  }

  // Refresh ScrollTrigger (useful after DOM changes)
  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh()
  }

  // Kill all ScrollTriggers
  const killScrollTriggers = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  onUnmounted(() => {
    killScrollTriggers()
  })

  return {
    gsap,
    ScrollTrigger,
    fadeIn,
    staggerIn,
    parallax,
    scaleOnScroll,
    colorTransition,
    refreshScrollTrigger,
    killScrollTriggers
  }
}
