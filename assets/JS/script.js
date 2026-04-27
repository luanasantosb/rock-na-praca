/* ==== VLIBRAS=====*/

document.addEventListener("DOMContentLoaded", function() {
  const vlibrasDiv = document.createElement('div');
  vlibrasDiv.innerHTML = `
    <div vw class="enabled">
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  `;
  document.body.appendChild(vlibrasDiv);
  const scriptVlibras = document.createElement('script');
  scriptVlibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  scriptVlibras.async = true;
  scriptVlibras.onload = () => {
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  };
  document.head.appendChild(scriptVlibras);
});

/*=====ENQUETE======*/

window.addEventListener('load', () => {
  setTimeout(() => {
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.head.appendChild(script);
  }, 5000); 
});


/*===== CABECALHO =====*/

const btnMenu = document.getElementById("menu-hamburguer");
const menu = document.getElementById("menu");
const submenuToggle = document.querySelector(".menu-toggle");
const submenu = document.querySelector(".submenu");

if (btnMenu && menu) {
  btnMenu.addEventListener("click", () => {
    menu.classList.toggle("abrir");
    const aberto = menu.classList.contains("abrir");
    btnMenu.setAttribute("aria-expanded", aberto);
  });
}

if (submenuToggle && submenu) {
  submenuToggle.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      const isOpen = submenu.classList.toggle("submenu-mobile");
      submenuToggle.setAttribute("aria-expanded", isOpen);
    }
  });
}

if (menu) {
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        menu.classList.remove("abrir");
        if (submenu) submenu.classList.remove("submenu-mobile");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (
      menu &&
      btnMenu &&
      !menu.contains(event.target) &&
      !btnMenu.contains(event.target)
    ) {
      menu.classList.remove("abrir");
      if (submenu) submenu.classList.remove("submenu-mobile");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.remove("abrir");
      if (submenu) submenu.classList.remove("submenu-mobile");
    }
  });
}

/*===== CONTADOR =====*/

const counters = document.querySelectorAll('.contador-numero');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.dataset.target;
      let current = 0;
      const increment = target / 100;

      const update = () => {
        if (current < target) {
          current += increment;
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };

      update();
      observer.unobserve(counter);
    }
  });
}, { threshold: 0.6 });

counters.forEach(counter => observer.observe(counter));

/*====== YOUTUBE =======*/

const container = document.getElementById("videos-lateral");
const PROXY_URL = "https://script.google.com/macros/s/AKfycbxzFVPEnl9xdaj2uF89ZCSe8ONRF4vJjdaWfSWJSWst7bsnpGTooKGEs8HoPVRU9XQQ/exec";

async function carregarVideos() {
  if (!container) return;

  try {
    const response = await fetch(PROXY_URL);
    const data = await response.json();

    container.innerHTML = "";

    if (data.error) {
      container.innerHTML = `<p>Erro: ${data.error}</p>`;
      return;
    }

    if (!data.items || data.items.length === 0) {
      container.innerHTML = "<p>Não há vídeos disponíveis.</p>";
      return;
    }

    const fragment = document.createDocumentFragment();

    data.items.forEach(video => {
      const videoId = video.snippet.resourceId.videoId;
      const snippet = video.snippet;

      const card = document.createElement("div");
      card.className = "cartao-video";

      card.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">
          <img src="${snippet.thumbnails.medium.url}" 
               alt="${snippet.title}" 
               loading="lazy">
          <h4>${snippet.title}</h4>
        </a>
      `;

      fragment.appendChild(card);
    });

    container.appendChild(fragment);

  } catch (error) {
    console.error("Erro ao carregar vídeos:", error);
    container.innerHTML = "<p>Não foi possível carregar os vídeos.</p>";
  }
}

window.addEventListener('load', () => {
  if (container) setTimeout(carregarVideos, 1000);
});


/*============== LOJA ================*/

const STORAGE_KEY = "carrinhoRNP";

const quantidadeSpan = document.getElementById("quantidadeTotal");
const totalSpan = document.getElementById("total");
const btnLimpar = document.getElementById("btnLimpar");
const btnFinalizar = document.getElementById("btnFinalizar");
const listaCarrinho = document.getElementById("listaCarrinho");

function carregarCarrinho() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
}

function renderizarItens(carrinho) {
  if (!listaCarrinho) return;

  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  carrinho.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrinho");

    div.innerHTML = `
      <p><strong>${item.nome}</strong>
      Quantidade: 1
      Subtotal: R$ ${item.preco.toFixed(2)}
      <hr>
    `;

    listaCarrinho.appendChild(div);
  });
}

function atualizarCarrinho() {
  const carrinho = carregarCarrinho();

  if (quantidadeSpan)
    quantidadeSpan.textContent = carrinho.length;

  if (totalSpan) {
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    totalSpan.textContent = total.toFixed(2);
  }

  renderizarItens(carrinho);
}

document.addEventListener("DOMContentLoaded", atualizarCarrinho);

if (btnLimpar) {
  btnLimpar.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    atualizarCarrinho();
  });
}

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    const carrinho = carregarCarrinho();

    if (carrinho.length === 0) {
      alert("Carrinho vazio");
      return;
    }

    let mensagem = "Meu pedido Rock na Praça:\n";

    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });

    const total = carrinho.reduce((soma, i) => soma + i.preco, 0);

    mensagem += `Total: R$ ${total.toFixed(2)}`;

    const telefone = "555192179735";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
  });
}



document.addEventListener('DOMContentLoaded', function() {
  const produtos = document.querySelectorAll('.loja-cartao');

  produtos.forEach(produto => {
    const expiraData = produto.dataset.expira;
    const contador = produto.querySelector('.contador-loja');
    const link = produto.querySelector('.cartao-produto-detalhes');

    if (!expiraData || !contador) return;

    const expira = new Date(expiraData);

    function atualizarContador() {
      const agora = new Date();
      const diff = expira - agora;

      if (diff <= 0) {
        contador.textContent = "Venda encerrada";
        produto.classList.add('encerrado');
        clearInterval(intervalo);
        return;
      }

      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);

      contador.textContent = `Tempo restante: ${horas}h ${minutos}m ${segundos}s`;
    }

    atualizarContador();
    const intervalo = setInterval(atualizarContador, 1000);
  });
});

/******RODAPÉ************/
document.addEventListener("DOMContentLoaded", () => {
  const footerNome = document.getElementById("footer_nome");

  if (!footerNome) return;

  fetch("/data/footer.json")
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

