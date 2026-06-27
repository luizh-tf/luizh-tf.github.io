/**
 * HTF Digital — Scripts v2
 * Soluções Digitais Para Sua Marca
 *
 * Funcionalidades: menu mobile, scroll progress, revelação de seções,
 * validação em tempo real, formulário de contato, animação de números,
 * header inteligente, dropdown mobile e micro-interações
 */

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================
  // 1. HEADER — SCROLL INTELLIGENTE
  // ==========================================
  const header = document.querySelector('.header');

  function updateHeaderOnScroll() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll(); // estado inicial

  // ==========================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================
  const progressBar = document.getElementById('scrollProgress');

  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ==========================================
  // 3. MENU MOBILE (HAMBURGER + OVERLAY)
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  const menuOverlay = document.getElementById('menuOverlay');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mainNav.classList.contains('header__nav--open');

    mainNav.classList.toggle('header__nav--open', isOpen);
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', isOpen);
    if (menuOverlay) menuOverlay.classList.toggle('header__overlay--visible', isOpen);

    // Troca ícone
    const icon = hamburgerBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }

    // Previne scroll do body quando menu aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    toggleMenu(false);
  }

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', function () {
      toggleMenu();
    });

    // Fecha ao clicar em link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao clicar no overlay
    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Fecha ao pressionar Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('header__nav--open')) {
        closeMenu();
      }
    });
  }

  // ==========================================
  // 4. SCROLL SUAVE PARA ÂNCORAS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#' || !href) return;

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;

        window.scrollTo({
          top: target.offsetTop - headerHeight - 10,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 5. REVELAÇÃO DE SEÇÕES (Intersection Observer)
  // ==========================================
  function createRevealObserver(selector, threshold) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: threshold || 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  createRevealObserver('.section-reveal', 0.1);
  createRevealObserver('.card-reveal', 0.1);

  // ==========================================
  // 6. ANIMAÇÃO DE NÚMEROS (contador)
  // ==========================================
  const numberElements = document.querySelectorAll('.numbers__value');

  if (numberElements.length > 0) {
    let numbersAnimated = false;

    function animateNumbers() {
      if (numbersAnimated) return;
      numbersAnimated = true;

      numberElements.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        function updateNumber(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing cúbico suave
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(eased * target);

          // Detecta se é porcentagem pelo label
          const parent = el.closest('.numbers__item');
          const label = parent ? parent.querySelector('.numbers__label') : null;
          const isPercent = label && label.textContent.includes('%');

          el.textContent = isPercent ? currentValue + '%' : currentValue + '+';

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = isPercent ? target + '%' : target + '+';
          }
        }

        requestAnimationFrame(updateNumber);
      });
    }

    const numbersSection = document.querySelector('.numbers');
    if (numbersSection) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(numbersSection);
    }
  }

  // ==========================================
  // 7. FORMULÁRIO — VALIDAÇÃO EM TEMPO REAL
  // ==========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nome = document.getElementById('formNome');
    const email = document.getElementById('formEmail');
    const telefone = document.getElementById('formTelefone');
    const mensagem = document.getElementById('formMensagem');

    // Validação em tempo real (on blur)
    function validateField(input, validator) {
      const errorSpan = input.parentElement.querySelector('.form__error');
      if (!errorSpan) return;

      input.addEventListener('blur', function () {
        const result = validator(input.value.trim());
        if (result !== true) {
          input.classList.add('input--error');
          errorSpan.textContent = result;
        } else {
          input.classList.remove('input--error');
          errorSpan.textContent = '';
        }
      });

      input.addEventListener('input', function () {
        // Remove erro enquanto digita (se já estava válido)
        if (input.classList.contains('input--error')) {
          const result = validator(input.value.trim());
          if (result === true) {
            input.classList.remove('input--error');
            errorSpan.textContent = '';
          }
        }
      });
    }

    // Validadores individuais
    function validateNome(val) {
      return val.length >= 2 ? true : 'Por favor, informe seu nome.';
    }

    function validateEmail(val) {
      if (!val) return 'Por favor, informe seu e-mail.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? true : 'Informe um e-mail válido.';
    }

    function validateMensagem(val) {
      return val.length >= 10 ? true : 'A mensagem deve ter pelo menos 10 caracteres.';
    }

    validateField(nome, validateNome);
    validateField(email, validateEmail);
    validateField(mensagem, validateMensagem);

    // Submit
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      let isValid = true;
      let firstInvalid = null;

      // Limpa erros anteriores
      contactForm.querySelectorAll('.form__error').forEach(function (el) {
        el.textContent = '';
      });
      contactForm.querySelectorAll('.input--error').forEach(function (el) {
        el.classList.remove('input--error');
      });

      function showError(input, message) {
        isValid = false;
        input.classList.add('input--error');
        const errorSpan = input.parentElement.querySelector('.form__error');
        if (errorSpan) errorSpan.textContent = message;
        if (!firstInvalid) firstInvalid = input;
      }

      // Valida todos os campos
      const nomeVal = nome.value.trim();
      const emailVal = email.value.trim();
      const mensagemVal = mensagem.value.trim();

      const nomeResult = validateNome(nomeVal);
      if (nomeResult !== true) showError(nome, nomeResult);

      const emailResult = validateEmail(emailVal);
      if (emailResult !== true) showError(email, emailResult);

      const msgResult = validateMensagem(mensagemVal);
      if (msgResult !== true) showError(mensagem, msgResult);

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // --- ENVIO ---
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';

      const formData = {
        nome: nomeVal,
        email: emailVal,
        telefone: telefone.value.trim(),
        mensagem: mensagemVal
      };

      // ALTERE A URL ABAIXO PARA SEU ENDPOINT (Formspree, Web3Forms, etc.)
      const endpoint = 'https://formspree.io/f/SEU_FORM_ID';

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function (response) {
        if (response.ok) return response.json();
        throw new Error('Erro ao enviar mensagem');
      })
      .then(function () {
        contactForm.innerHTML = `
          <div class="form__success">
            <div class="form__success-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3>Mensagem Enviada!</h3>
            <p>Obrigado pelo contato, <strong>${formData.nome}</strong>!<br>Responderemos em breve.</p>
          </div>
        `;
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 1rem; margin-top: 1rem; text-align: center;';
        errorMsg.innerHTML = `
          <p style="color: #ef4444; font-size: 0.9rem;">
            <i class="fas fa-exclamation-triangle"></i>
            Não foi possível enviar sua mensagem agora.
            Tente novamente mais tarde ou envie um e-mail diretamente para
            <a href="mailto:luizhtf@outlook.com" style="color: #06b6d4; text-decoration: underline;">
              luizhtf@outlook.com
            </a>
          </p>
        `;
        contactForm.appendChild(errorMsg);
      });
    });
  }

  // ==========================================
  // 8. DROPDOWN NO MOBILE (toque)
  // ==========================================
  document.querySelectorAll('.header__link--dropdown').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth > 768) return;

      e.preventDefault();
      const dropdown = toggle.closest('.header__dropdown');
      const menu = dropdown.querySelector('.header__dropdown-menu');

      if (menu) {
        const isOpen = menu.classList.toggle('header__dropdown-menu--open');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
          icon.style.transition = 'transform 0.3s ease';
        }
      }
    });
  });

  // ==========================================
  // 9. LINK ATIVO NO SCROLL (highlights)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    function updateActiveLink() {
      let current = '';
      const scrollPos = window.scrollY + 120;

      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = '#' + section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('header__link--active');
        if (link.getAttribute('href') === current) {
          link.classList.add('header__link--active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

});