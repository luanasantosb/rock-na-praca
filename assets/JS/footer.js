/******RODAPÉ************/
document.addEventListener("DOMContentLoaded", () => {
  const footerNome = document.getElementById("footer_nome");

  if (!footerNome) return;

  fetch("content/rodape.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Não foi possível carregar o footer.json");
      }

      return response.json();
    })
    .then(data => {
      document.getElementById("footer_nome").textContent = data.nome;
      document.getElementById("footer_descricao").textContent = data.descricao;
      document.getElementById("footer_frase").textContent = data.frase;

      Object.keys(data.redes).forEach(rede => {
        const item = data.redes[rede];

        const link = document.getElementById(`footer_${rede}`);
        const img = document.getElementById(`img_${rede}`);

        if (!link || !img) return;

        link.href = item.link;
        link.title = item.title;
        link.setAttribute("aria-label", item.alt);

        img.src = item.icone;
        img.alt = item.alt;
      });

      const produtora = document.getElementById("footer_produtora");
      produtora.textContent = data.produtora.nome;
      produtora.href = data.produtora.link;

      const dev = document.getElementById("footer_dev");
      dev.textContent = data.dev.nome;
      dev.href = data.dev.link;
    })
    .catch(error => {
      console.error("Erro ao carregar dados do rodapé:", error);
    });
});
