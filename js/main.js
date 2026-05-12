// Main portfolio entry point, initializes all animations and interactions
// Author: bam841
import { animateHero, sectionReveal, skillBars, counters, parallaxBg, initNav } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  animateHero();
  sectionReveal();
  skillBars();
  counters();
  parallaxBg();
  initNav();
  // You can add additional module initialization here
});
