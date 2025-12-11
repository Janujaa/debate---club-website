// scripts/app.js
console.log("JS is working!");

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const tgt = document.querySelector(href);
      if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Demo contact handler (safe null checks)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
      };
      alert('Thanks, ' + (data.name || 'there') + '! This form is a demo — connect it to a backend to collect submissions.');
      form.reset();
      console.log('Contact (demo):', data);
    });
  }

  // Events button handler (safe null check)
  const eventsBtn = document.getElementById('eventsBtn');
  if (eventsBtn) {
    eventsBtn.addEventListener('click', () => {
      alert('Upcoming events will be added soon!');
    });
  } else {
    console.warn('eventsBtn not found in DOM. Make sure the button has id="eventsBtn"');
  }
});
