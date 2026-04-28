/*====================Cabecalho===================*/

document.addEventListener("DOMContentLoaded", () => {
  fetch("/content/cabecalho.json")
    .then(res => {
      if (!res.ok) throw new Error(`JSON não encontrado: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const logoContainer = document.getElementById("logo");
      const menu = document.getElementById("menu");

      if (!logoContainer || !menu) {
        throw new Error("Elementos #logo ou #menu não encontrados no HTML");
      }

      logoContainer.innerHTML = `
        <a href="${data.logo?.link || "/"}" style="display:inline-block;">
          <img src="${data.logo?.imagem || ""}"
            alt="${data.logo?.alt || ""}"
            title="${data.logo?.title || ""}"
            loading="eager">
        </a>
      `;

      menu.innerHTML = "";

      data.menu?.forEach(item => {
        if (item.submenu && item.submenu.length > 0) {
          const div = document.createElement("div");
          div.classList.add("menu-item");

          div.innerHTML = `
            <button class="menu-toggle" aria-expanded="false" aria-haspopup="true">
              ${item.nome}
            </button>
            <div class="submenu">
              ${item.submenu.map(sub => `
                <a href="${sub.url}" title="${sub.title || ""}" itemprop="url">
                  <span itemprop="name">${sub.nome}</span>
                </a>
              `).join("")}
            </div>
          `;

          menu.appendChild(div);
        } else {
          const a = document.createElement("a");
          a.href = item.url || "#";
          a.title = item.title || item.nome || "";
          a.setAttribute("itemprop", "url");
          a.innerHTML = `<span itemprop="name">${item.nome}</span>`;
          menu.appendChild(a);
        }
      });
    })
    .catch(err => console.error("Erro ao carregar cabeçalho:", err));
});