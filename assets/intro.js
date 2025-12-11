(function(){
  const splash = document.getElementById('intro-splash');
  const header = document.getElementById('site-header');
  const main = document.querySelector('.main-inner');

  if(!splash || !header || !main) return;

  // Calculate header logo position to animate towards
  function getHeaderLogoPos(){
    const logo = header.querySelector('.logo');
    if(!logo){
      // fallback: logo is at ~22px from left + 44px width, ~22px from top
      return {x: 66, y: 44};
    }
    const rect = logo.getBoundingClientRect();
    return {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    };
  }

  // Set CSS variables for animation target positions
  function setAnimationTargets(){
    const pos = getHeaderLogoPos();
    document.documentElement.style.setProperty('--header-logo-x', pos.x + 'px');
    document.documentElement.style.setProperty('--header-logo-y', pos.y + 'px');
  }

  // Trigger animations
  function runIntro(){
    // Set target position
    setAnimationTargets();

    // Trigger fade-out of splash after animations complete
    setTimeout(() => {
      splash.classList.add('fade-out');
    }, 1200);

    // Reveal header and main content
    setTimeout(() => {
      header.classList.add('reveal');
      main.classList.add('reveal');
    }, 1400);

    // Remove splash from DOM after fade completes
    setTimeout(() => {
      splash.style.display = 'none';
    }, 1900);
  }

  // Recalculate on resize for responsiveness
  window.addEventListener('resize', setAnimationTargets);

  // Start intro
  runIntro();
})();
