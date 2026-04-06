// SafeMode - JavaScript Interactions

document.addEventListener('DOMContentLoaded', () => {
  // ===== Auth Modal =====
  const modal = document.getElementById('auth-modal');
  const modalClose = document.getElementById('auth-modal-close');
  const authForm = document.getElementById('auth-form');
  const authEmail = document.getElementById('auth-email');
  const authBtn = document.getElementById('auth-btn');
  const authMsg = document.getElementById('auth-msg');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      if (authEmail) authEmail.focus();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      if (authMsg) {
        authMsg.textContent = '';
        authMsg.className = 'auth-msg';
      }
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = authEmail.value.trim();
      if (!email) return;

      authBtn.disabled = true;
      authBtn.textContent = 'Sending...';
      authMsg.textContent = '';
      authMsg.className = 'auth-msg';

      window.safemodeAuth.signIn(email).then(function (result) {
        if (result.error) {
          authMsg.textContent = result.error.message;
          authMsg.className = 'auth-msg error';
          authBtn.disabled = false;
          authBtn.textContent = 'Send Magic Link';
        } else {
          authMsg.textContent = 'Check your inbox! We sent a sign-in link to ' + email;
          authMsg.className = 'auth-msg success';
          authBtn.textContent = 'Link Sent';
        }
      });
    });
  }

  // Wire all CTA buttons to open modal (or sign out if logged in)
  function wireCtaButtons() {
    document.querySelectorAll('[data-auth-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (btn.classList.contains('signed-in')) {
          window.safemodeAuth.signOut().then(function () {
            updateAuthUI(null);
          });
        } else {
          openModal();
        }
      });
    });
  }

  // Update all CTA buttons based on auth state
  function updateAuthUI(session) {
    document.querySelectorAll('[data-auth-trigger]').forEach(function (btn) {
      var role = btn.getAttribute('data-auth-trigger');
      if (session) {
        btn.classList.add('signed-in');
        if (role === 'nav') {
          btn.textContent = 'Sign Out';
        } else if (role === 'hero') {
          btn.textContent = 'Welcome ';
          var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          // Keep arrow on hero buttons but not nav
        } else if (role === 'pricing') {
          btn.textContent = 'You\'re on the list';
          btn.style.pointerEvents = 'none';
          btn.style.opacity = '0.5';
        }
      } else {
        btn.classList.remove('signed-in');
        if (role === 'nav') {
          btn.textContent = 'Join Beta';
        } else if (role === 'hero') {
          // Reset hero CTA - reconstruct with arrow
          btn.textContent = '';
          btn.appendChild(document.createTextNode('Join Beta'));
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '16');
          svg.setAttribute('height', '16');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-width', '2');
          svg.setAttribute('stroke-linecap', 'round');
          svg.setAttribute('stroke-linejoin', 'round');
          var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p1.setAttribute('d', 'm5 12h14');
          var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p2.setAttribute('d', 'm12 5 7 7-7 7');
          svg.appendChild(p1);
          svg.appendChild(p2);
          btn.appendChild(svg);
        } else if (role === 'pricing') {
          btn.textContent = 'Join waitlist';
          btn.style.pointerEvents = '';
          btn.style.opacity = '';
        }
      }
    });
  }

  wireCtaButtons();

  // Check auth state on load
  if (window.safemodeAuth) {
    window.safemodeAuth.getSession().then(function (result) {
      if (result.data.session) {
        updateAuthUI(result.data.session);
      }
    });

    window.safemodeAuth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_IN' && session) {
        closeModal();
        updateAuthUI(session);
        // Clean hash fragment from magic link redirect
        if (window.location.hash) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      } else if (event === 'SIGNED_OUT') {
        updateAuthUI(null);
      }
    });
  }

  // ===== Theme Toggle =====
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    // Check saved preference or system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ===== Mobile Nav Toggle =====
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      toggle.classList.toggle('is-open');
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.classList.remove('is-open');
      });
    });
  }

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===== Scroll Reveal =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${i % 3 * 100}ms`;
      observer.observe(el);
    });
  }

  // ===== Copy Code Blocks =====
  document.querySelectorAll('.code-block-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-block').querySelector('pre').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });

  // ===== Docs Sidebar Toggle (Mobile) =====
  const docsSidebarToggle = document.querySelector('.docs-sidebar-toggle');
  const docsSidebar = document.querySelector('.docs-sidebar');
  if (docsSidebarToggle && docsSidebar) {
    docsSidebarToggle.addEventListener('click', () => {
      docsSidebar.classList.toggle('active');
    });
  }
});
