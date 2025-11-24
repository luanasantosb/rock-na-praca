/* ---------------------------------
   CABEÇALHO
---------------------------------- */
const menuBtn = document.getElementById('menu-hamburguer');
const menu = document.getElementById('menu');
let aberto = false;

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('ativo');
    aberto = !aberto;
    menuBtn.innerHTML = aberto ? '&times;' : '&#9776;';
  });
}

/* ---------------------------------
   CARROSSEL
---------------------------------- */
let index = 0;
const wrapper = document.getElementById('carrossel');
const totalSlides = wrapper ? wrapper.children.length : 0;

function moverSlide(direcao) {
  if (!wrapper) return;
  index += direcao;
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  wrapper.style.transform = `translateX(-${index * 100}%)`;
}

/* ---------------------------------
   BANNER
---------------------------------- */
const exibirBanner = false;
const banner = document.getElementById("banner");

if (banner) {
  banner.style.display = exibirBanner ? "block" : "none";
}

/* ---------------------------------
   CONTADORES
---------------------------------- */
function animarContadores() {
  const contadores = document.querySelectorAll('.numero');
  const velocidade = 100;

  contadores.forEach(contador => {
    const valorFinal = +contador.getAttribute('data-numero');
    const incremento = Math.ceil(valorFinal / velocidade);
    let valorAtual = 0;

    const atualizar = () => {
      valorAtual += incremento;
      if (valorAtual >= valorFinal) {
        contador.textContent = valorFinal.toLocaleString('pt-BR');
      } else {
        contador.textContent = valorAtual.toLocaleString('pt-BR');
        requestAnimationFrame(atualizar);
      }
    };

    atualizar();
  });
}

const section = document.getElementById('dados');
let jaAnimou = false;

if (section) {
  window.addEventListener('scroll', () => {
    const posicao = section.getBoundingClientRect().top;
    const alturaTela = window.innerHeight;

    if (posicao < alturaTela * 0.8 && !jaAnimou) {
      section.classList.add('ativo');
      animarContadores();
      jaAnimou = true;
    }
  });
}

/* ---------------------------------
   CARRINHO DA LOJA
---------------------------------- */
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionar(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  salvarCarrinho();
  mostrarCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function mostrarCarrinho() {
  const lista = document.getElementById("itens");
  const totalEl = document.getElementById("total");
  const qtdEl = document.getElementById("quantidadeTotal");

  if (!lista || !totalEl || !qtdEl) return;

  lista.innerHTML = "";
  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;
    quantidadeTotal += item.quantidade;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} - R$${item.preco.toFixed(2)} x ${item.quantidade}
      <button onclick="removerItem(${index})">X</button>
    `;
    lista.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  qtdEl.textContent = quantidadeTotal;
}

function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  mostrarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  localStorage.removeItem("carrinho");
  mostrarCarrinho();
}

function enviarWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = " *Meu pedido Rock na Praça:*\n\n";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome} (x${item.quantidade}) - R$${(item.preco * item.quantidade).toFixed(2)}\n`;
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  mensagem += `\n *Total:* R$${total.toFixed(2)}\n\n`;

  const numeroWhatsApp = "555196506622";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", mostrarCarrinho);

/* ---------------------------------
   YOUTUBE LAZY-LOAD
---------------------------------- */
function loadYouTubeIframe(div) {
  const id = div.dataset.id;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`;
  iframe.width = "560";
  iframe.height = "315";
  iframe.frameBorder = "0";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  div.appendChild(iframe);
}

function setupYouTubeLazyLoad() {
  const divs = document.querySelectorAll(".youtube");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadYouTubeIframe(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "200px" });

  divs.forEach(div => observer.observe(div));
}

/* ---------------------------------
   GOOGLE MAPS LAZY-LOAD
---------------------------------- */
function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const map = new google.maps.Map(mapEl, {
    center: { lat: -29.7356, lng: -51.1539 },
    zoom: 13,
  });

  new google.maps.Marker({
    position: { lat: -29.7356, lng: -51.1539 },
    map: map,
    title: "Rock na Praça Esteio",
  });
}

function loadMapScript() {
  if (document.getElementById("google-maps-script")) return;

  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap";
  script.async = true;
  document.body.appendChild(script);
}

function setupMapLazyLoad() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMapScript();
        observer.disconnect();
      }
    });
  }, { rootMargin: "200px" });

  observer.observe(mapEl);
}

/* ---------------------------------
   INICIALIZAÇÃO AO CARREGAR DOM
---------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setupYouTubeLazyLoad();
  setupMapLazyLoad();
});
