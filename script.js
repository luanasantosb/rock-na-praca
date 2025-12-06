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
   BANNER
---------------------------------- */
const mostrarBanner1 = false;
const mostrarBanner2 = false;
const mostrarBanner3 = false;

const banner1 = document.querySelector(".banner1");
const banner2 = document.querySelector(".banner2");
const banner3 = document.querySelector(".banner3");

if (banner1) banner1.style.display = mostrarBanner1 ? "block" : "none";
if (banner2) banner2.style.display = mostrarBanner2 ? "block" : "none";
if (banner3) banner3.style.display = mostrarBanner3 ? "block" : "none";


/* ---------------------------------
   CONTADORES
---------------------------------- */
function animarContadores() {
  const contadores = document.querySelectorAll('.numero');
  const velocidade = 200;

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

const section = document.querySelector('#dados');

if (section) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContadores();
        observer.unobserve(section); 
      }
    });
  }, {
    threshold: 0.5 
  });

  observer.observe(section);
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


