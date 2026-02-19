if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registado com sucesso!', reg))
      .catch(err => console.log('Erro ao registar o Service Worker', err));
  });
}

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

/*====== MODAL =======*/

function abrirMapa() {
  const modal = document.getElementById("modalMapa");
  if (modal) modal.classList.add("ativo");
}

function fecharMapa() {
  const modal = document.getElementById("modalMapa");
  if (modal) modal.classList.remove("ativo");
}

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
/*CONTADOR LOJA*/

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
