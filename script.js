/* -------------------------
                                                                                CABEÇALHO
   ------------------------- */
const menuBtn = document.getElementById('menu-hamburguer');
const menu = document.getElementById('menu');
let aberto = false;

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('ativo');
  aberto = !aberto;
  // Animação simples do ícone (☰ → ✕)
  menuBtn.innerHTML = aberto ? '&times;' : '&#9776;';
});


/* -------------------------
                                                                              CONTADOR
   ------------------------- */

function animarContadores() {
  const contadores = document.querySelectorAll('.numero');
  const velocidade = 100; // menor = mais rápido

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

window.addEventListener('scroll', () => {
  const posicao = section.getBoundingClientRect().top;
  const alturaTela = window.innerHeight;

  if (posicao < alturaTela * 0.8 && !jaAnimou) {
    section.classList.add('ativo');
    animarContadores();
    jaAnimou = true;
  }
});

/* -------------------------
                                                                            Videos
   ------------------------- */
 
    // Substitua pelos seus dados da API
    const API_KEY = 'YOUR_API_KEY';
    const CHANNEL_ID = 'YOUR_CHANNEL_ID';
    const MAX_RESULTS = 3; // exibe 3 vídeos

    async function loadVideos() {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`
      );

      const data = await response.json();
      const gallery = document.getElementById('video-gallery');
      gallery.innerHTML = '';

      data.items.forEach(item => {
        if (item.id.videoId) {
          const card = document.createElement('div');
          card.classList.add('video-card');

          card.innerHTML = `
            <div class="video-thumb">
              <iframe src="https://www.youtube.com/embed/${item.id.videoId}" allowfullscreen></iframe>
            </div>
            <div class="video-info">
              <h3>${item.snippet.title}</h3>
              <p>${item.snippet.description.substring(0, 80)}...</p>
              <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">Assistir no YouTube</a>
            </div>
          `;

          gallery.appendChild(card);
        }
      });
    }

    loadVideos();


/*LOJA */

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
  mensagem += " Enviado via loja Rock na Praça";

  const numeroWhatsApp = "555196506622";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", mostrarCarrinho);
