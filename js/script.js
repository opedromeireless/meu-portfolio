const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const scrollProgress = document.getElementById("scroll-progress");

if (scrollProgress) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${percent}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

document.querySelectorAll(".glass-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

if (!prefersReducedMotion) {
  document.querySelectorAll(".project-mini-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0) rotateY(0)";
    });
  });
}

const terminalBody = document.getElementById("terminal-body");

if (terminalBody) {
  const lines = [
    '<span class="tk">const</span> <span class="tprop">dev</span> <span class="tpunc">=</span> <span class="tpunc">{</span>',
    '  <span class="tprop">name</span><span class="tpunc">:</span> <span class="tstr">"Pedro Meireles"</span><span class="tpunc">,</span>',
    '  <span class="tprop">role</span><span class="tpunc">:</span> <span class="tstr">"Full Stack Developer"</span><span class="tpunc">,</span>',
    '  <span class="tprop">stack</span><span class="tpunc">:</span> <span class="tpunc">[</span><span class="tstr">"React"</span><span class="tpunc">,</span> <span class="tstr">"Node.js"</span><span class="tpunc">,</span> <span class="tstr">"Laravel"</span><span class="tpunc">],</span>',
    '  <span class="tprop">focus</span><span class="tpunc">:</span> <span class="tstr">"shipping code daily"</span><span class="tpunc">,</span>',
    '<span class="tpunc">};</span>',
  ];

  if (prefersReducedMotion) {
    terminalBody.innerHTML = lines.join("<br>");
  } else {
    let lineIndex = 0;

    const typeNextLine = () => {
      if (lineIndex >= lines.length) {
        terminalBody.insertAdjacentHTML(
          "beforeend",
          '<span class="terminal-cursor"></span>',
        );
        return;
      }
      const temp = document.createElement("div");
      temp.innerHTML = lines[lineIndex];
      const plainLength = temp.textContent.length;
      const targetHtml = lines[lineIndex];

      const lineEl = document.createElement("div");
      terminalBody.appendChild(lineEl);
      let charCount = 0;
      const revealInterval = setInterval(() => {
        charCount += 3;
        if (charCount >= plainLength) {
          lineEl.innerHTML = targetHtml;
          clearInterval(revealInterval);
          lineIndex += 1;
          setTimeout(typeNextLine, 90);
        } else {
          lineEl.textContent = temp.textContent.slice(0, charCount);
        }
      }, 12);
    };

    typeNextLine();
  }
}

const ctaBtn = document.getElementById("cta-btn");

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    window.location.href = "projetos.html#contato-section";
  });
}

const cepInput = document.getElementById("cep");

if (cepInput) {
  cepInput.addEventListener("input", () => {
    cepInput.value = cepInput.value.replace(/\D/g, "");
  });

  cepInput.addEventListener("blur", async () => {
    const cep = cepInput.value.replace(/\D/g);
    const logradouroInput = document.getElementById("logradouro");

    if (cep.length === 0) return;

    if (cep.length !== 8) {
      logradouroInput.value = "";
      logradouroInput.placeholder = "CEP inválido, digite 8 números";
      return;
    }

    try {
      logradouroInput.value = "Buscando endereço...";

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        logradouroInput.value = "";
        logradouroInput.placeholder = "CEP não encontrado";
        return;
      }

      logradouroInput.value = `${data.logradouro} - ${data.bairro}, ${data.localidade}/${data.uf}`;
    } catch (error) {
      console.error("Erro na requisição ViaCEP", error);
      logradouroInput.value = "";
      logradouroInput.placeholder =
        "Falha ao buscar. Preencha manualmente se necessário.";
    }
  });
}

const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

function showFeedback(message, type) {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.className = `form-feedback is-visible ${type}`;
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".btn-submit");
    const nomeUsuario = document.getElementById("nome").value.trim();

    if (!nomeUsuario) {
      showFeedback("Por favor, preencha seu nome antes de enviar.", "error");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      showFeedback(
        `Obrigado pelo contato, ${nomeUsuario}! Sua mensagem foi enviada com sucesso (simulação).`,
        "success",
      );
      contactForm.reset();
      const logradouroInput = document.getElementById("logradouro");
      if (logradouroInput) {
        logradouroInput.placeholder = "Aguardando CEP...";
      }
      if (submitBtn) submitBtn.disabled = false;
    }, 500);
  });
}

const revealElements = document.querySelector(".reveal");

if (revealElements.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}
