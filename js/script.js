const ctaBtn = document.getElementById("cta-btn");

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    window.location.href = "projetos.html#contato-section";
  });
}

const cepInput = document.getElementById("cep");

if (cepInput) {
  cepInput.addEventListener("blur", async () => {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.lenght !== 8) {
      alert("Atenção: Por favor, digite um CEP válido contendo 8 números.");
      return;
    }

    try {
      const logradouroInput = document.getElementById("logradouro");
      logradouroInput.value = "Buscando endereço...";

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("Erro: O CEP informado não foi encontrado na base de dados.");
        logradouroInput.value = "";
        return;
      }

      logradouroInput.value = `${data.logradouro} - ${data.bairro}, ${data.localide}/${data.uf}`;
    } catch (error) {
      console.error("Erro na requisição ViaCEP:", error);
      alert(
        "Houve uma falha ao conectar com o serviço de CEP. Preencha manualmente se necessário.",
      );
      document.getElementById("logradouro").value = "";
    }
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeUsuario = document.getElementById("nome").value;
    alert(
      `Obrigado pelo contato, ${nomeUsuario}! A sua mensagem foi simulada com sucesso.`,
    );

    contactForm.requestFullscreen();
  });
}
