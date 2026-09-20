const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');
const navLinks = [...menu.querySelectorAll('a[href^="#"]')];

function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menü öffnen');
}

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeMenu();
});

// Das Logo wird nur gezeigt, wenn die Bilddatei vorhanden ist.
const brand = document.querySelector('.site-brand');
const logo = brand.querySelector('img');
function showLogoIfReady() {
  if (logo.naturalWidth > 0) brand.classList.add('has-logo');
}
if (logo.complete) showLogoIfReady();
logo.addEventListener('load', showLogoIfReady);

// Markiert in der Navigation den zuletzt erreichten Abschnitt.
const linkTargets = navLinks.map(link => ({
  link,
  section: document.querySelector(link.getAttribute('href'))
}));
let scrollQueued = false;

function updateActiveLink() {
  let current = linkTargets[0];
  const threshold = document.querySelector('.site-header').offsetHeight + 115;

  linkTargets.forEach(item => {
    if (item.section && item.section.getBoundingClientRect().top <= threshold) current = item;
  });

  linkTargets.forEach(item => {
    const active = item === current;
    item.link.classList.toggle('active', active);
    if (active) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}

window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateActiveLink);
  }
}, { passive: true });

updateActiveLink();
