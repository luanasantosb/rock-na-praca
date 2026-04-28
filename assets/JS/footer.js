document.addEventListener("DOMContentLoaded", () => {
  const footerNome = document.getElementById("footer_nome");
  if (!footerNome) return;

  fetch("/content/rodape.json")
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar rodapé");
      return response.json();
    })
    .then(data => {

      const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
      };

      setText("footer_nome", data.nome);
      setText("footer_descricao", data.descricao);
      setText("footer_frase", data.frase);

      if (data.redes) {
        Object.keys(data.redes).forEach(rede => {
          const item = data.redes[rede];

          const link = document.getElementById(`footer_${rede}`);
          const img = document.getElementById(`img_${rede}`);

          if (!link || !img) return;

          link.href = item.link || "#";
          link.title = item.title || "";
          link.setAttribute("aria-label", item.alt || "");

          img.src = item.icone || "";
          img.alt = item.alt || "";
        });
      }

      const produtora = document.getElementById("footer_produtora");
      if (produtora && data.produtora) {
        produtora.textContent = data.produtora.nome || "";
        produtora.href = data.produtora.link || "#";
      }

      const dev = document.getElementById("footer_dev");
      if (dev && data.dev) {
        dev.textContent = data.dev.nome || "";
        dev.href = data.dev.link || "#";
      }

    })
    .catch(err => console.error("Erro rodapé:", err));
});