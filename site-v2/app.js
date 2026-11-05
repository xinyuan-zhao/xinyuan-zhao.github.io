(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const journey = document.querySelector('.journey');
  const progressLine = document.querySelector('.journey-progress');
  const walker = document.querySelector('.walker');
  const journeyName = document.querySelector('.journey-name');
  const sections = [...document.querySelectorAll('.story-section')];
  const navLinks = [...document.querySelectorAll('.main-nav a')];

  const experienceSection = document.querySelector('#experience');
  const projectSection = document.querySelector('#work');
  if (experienceSection && projectSection) projectSection.before(experienceSection);

  const revealTargets = document.querySelectorAll(
    '.section-intro, .project, .capability-grid article, .working-style, .timeline-item, .about-layout, .contact-section > *'
  );
  revealTargets.forEach((element) => element.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const label = entry.target.dataset.label || 'Explore';
      if (journeyName) journeyName.textContent = label;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-38% 0px -52% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));

  let queued = false;
  const updateJourney = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    if (progressLine) progressLine.style.transform = `scaleY(${progress})`;
    if (walker && journey && !reducedMotion.matches) {
      const travel = Math.max(journey.clientHeight - 38, 120);
      walker.style.transform = `translate3d(0, ${progress * travel}px, 0)`;
      walker.dataset.frame = String(Math.floor(progress * 44) % 4);
    }
    queued = false;
  };

  const requestUpdate = () => {
    if (!queued) {
      requestAnimationFrame(updateJourney);
      queued = true;
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reducedMotion.addEventListener?.('change', requestUpdate);
  updateJourney();
})();
