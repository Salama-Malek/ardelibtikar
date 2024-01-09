const LAYOUT_BORDER_RADIUS = 30;

const footer = document.querySelector("footer");
const main = document.querySelector("main");
const mainLastChild = main.lastElementChild;
const flowerPattern = document.querySelector(".footer__flowerPatternContainer");
let animationFrameId = null;

mainLastChild.classList.add("overflow");

const animateMainContent = () => {
  const footerRect = footer.getBoundingClientRect();

  // Calculate the ratio of the footer that's visible
  const ratio = Math.max(
    0,
    Math.min(1, (window.innerHeight - footerRect.top) / footerRect.height)
  );

  // Apply styles based on the ratio
  const bottomValue = ratio * footerRect.height;
  const borderRadiusValue = ratio * LAYOUT_BORDER_RADIUS;

  main.style.bottom = `${bottomValue}px`;
  main.style.borderRadius = `${borderRadiusValue}px`;
  mainLastChild.style.borderBottomLeftRadius = `${borderRadiusValue}px`;
  mainLastChild.style.borderBottomRightRadius = `${borderRadiusValue}px`;

  if (ratio >= 0.8) {
    footer.style.zIndex = 1;
    flowerPattern.classList.add("footer__flowerPatternContainer--active");
  } else {
    footer.style.zIndex = -1;
    flowerPattern.classList.remove("footer__flowerPatternContainer--active");
  }

  // If the footer is still visible, continue the animation on the next frame
  if (footerRect.top < window.innerHeight) {
    animationFrameId = requestAnimationFrame(animateMainContent);
  }
};

const observer = new IntersectionObserver((entries) => {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      // Start the animation when the footer comes into view
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(animateMainContent);
      }
    } else {
      // Stop the animation when the footer is no longer in view
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }
});

observer.observe(footer);

// Handle window resize
window.addEventListener("resize", () => {
  // If an animation is currently running, cancel it
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  // Start a new animation
  animationFrameId = requestAnimationFrame(animateMainContent);
});
