 
 /*=====CABECALHO=====*/

 const btnMenu = document.getElementById("menu-hamburguer");
const menu = document.getElementById("menu");
const submenuToggle = document.querySelector(".menu-toggle");
const submenu = document.querySelector(".submenu");

// Abrir / fechar menu no mobile
btnMenu.addEventListener("click", () => {
  menu.classList.toggle("abrir");

  const aberto = menu.classList.contains("abrir");
  btnMenu.setAttribute("aria-expanded", aberto);
});

// Abrir / fechar submenu no mobile
submenuToggle.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    const isOpen = submenu.classList.toggle("submenu-mobile");

    submenuToggle.setAttribute("aria-expanded", isOpen);
  }
});

// Fecha menu ao clicar em um link (mobile)
menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      menu.classList.remove("abrir");
      submenu.classList.remove("submenu-mobile");
    }
  });
});


document.addEventListener("click", (event) => {
  if (
    !menu.contains(event.target) &&
    !btnMenu.contains(event.target)
  ) {
    menu.classList.remove("abrir");
    submenu.classList.remove("submenu-mobile");
  }
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menu.classList.remove("abrir");
    submenu.classList.remove("submenu-mobile");
  }
});

  
 /*======  CONTADORES===========*/
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


/*************    LOJA ************ */

const PIX_CHAVE = "83161163087";
const PIX_NOME = "Ricardo Varela";
const PIX_INSTITUICAO = "Pag Bank";
const WHATSAPP_NUMERO = "555192179735";

let carrinho = [];
let valorTotal = 0;

const listaItens = document.getElementById("itens");
const totalSpan = document.getElementById("total");
const quantidadeSpan = document.getElementById("quantidadeTotal");

/* ===============================
   LOCAL STORAGE
================================ */

function salvarCarrinho() {
  localStorage.setItem("carrinhoRNP", JSON.stringify(carrinho));
  localStorage.setItem("totalRNP", valorTotal.toFixed(2));
}

function carregarCarrinho() {
  try {
    const carrinhoSalvo = localStorage.getItem("carrinhoRNP");
    const totalSalvo = localStorage.getItem("totalRNP");

    if (carrinhoSalvo) {
      carrinho = JSON.parse(carrinhoSalvo);
      valorTotal = parseFloat(totalSalvo) || 0;
      renderCarrinho();
    }
  } catch (e) {
    console.error("Erro ao carregar carrinho:", e);
    limparCarrinho();
  }
}

carregarCarrinho();

/* ===============================
   CARROSSEL
================================ */

document.querySelectorAll(".card-loja").forEach(card => {
  const imagensData = card.dataset.imagens;
  const img = card.querySelector(".foto-produto");
  const prev = card.querySelector(".prev");
  const next = card.querySelector(".next");

  if (!imagensData || !img || !prev || !next) return;

  let imagens = [];

  try {
    imagens = JSON.parse(imagensData);
  } catch (e) {
    console.error("Erro ao ler data-imagens:", e);
    return;
  }

  let index = 0;

  prev.addEventListener("click", () => {
    index = (index - 1 + imagens.length) % imagens.length;
    img.src = imagens[index];
  });

  next.addEventListener("click", () => {
    index = (index + 1) % imagens.length;
    img.src = imagens[index];
  });
});

/* ===============================
   ADICIONAR AO CARRINHO
================================ */

document.querySelectorAll(".card-loja .botao-adicionar").forEach(botao => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".card-loja");
    const nome = card.dataset.nome;
    const preco = parseFloat(card.dataset.preco);

    if (isNaN(preco)) {
      alert("Preço inválido.");
      return;
    }

    const tamanhoSelect = card.querySelector('select[name="tamanho"]');
    const corSelect = card.querySelector('select[name="cor"]');

    const tamanho = tamanhoSelect ? tamanhoSelect.value : null;
    const cor = corSelect ? corSelect.value : null;

    if (tamanhoSelect && !tamanho) {
      alert("Selecione o tamanho.");
      return;
    }
    if (corSelect && !cor) {
      alert("Selecione a cor.");
      return;
    }

    adicionarAoCarrinho({
      id: Date.now(),
      nome,
      preco,
      tamanho,
      cor
    });
  });
});

/* ===============================
   FUNÇÕES DO CARRINHO
================================ */

function adicionarAoCarrinho(item) {
  carrinho.push(item);
  valorTotal += item.preco;
  salvarCarrinho();
  renderCarrinho();
}

function removerItem(id) {
  const index = carrinho.findIndex(item => item.id === id);
  if (index === -1) return;
  valorTotal -= carrinho[index].preco;
  carrinho.splice(index, 1);
  salvarCarrinho();
  renderCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  valorTotal = 0;
  salvarCarrinho();
  renderCarrinho();
}

function renderCarrinho() {
  if (!listaItens || !totalSpan || !quantidadeSpan) return;

  listaItens.innerHTML = "";

  carrinho.forEach(item => {
    const li = document.createElement("li");
    const variacao =
      item.tamanho && item.cor
        ? ` (${item.tamanho} / ${item.cor})`
        : "";
    li.innerHTML = `
      ${item.nome}${variacao} - R$ ${item.preco.toFixed(2)}
      <button aria-label="Remover item">✖</button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      removerItem(item.id);
    });
    listaItens.appendChild(li);
  });

  quantidadeSpan.textContent = carrinho.length;
  totalSpan.textContent = valorTotal.toFixed(2);
}

/* ===============================
   WHATSAPP
================================ */

function enviarWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "Pedido Rock na Praça\n\n";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome}`;
    if (item.tamanho && item.cor) {
      mensagem += ` (${item.tamanho} / ${item.cor})`;
    }
    mensagem += ` - R$ ${item.preco.toFixed(2)}\n`;
  });

  mensagem += `\nTotal: R$ ${valorTotal.toFixed(2)}\n\n`;
  mensagem += `PIX:\nChave: ${PIX_CHAVE}\nNome: ${PIX_NOME}\nInstituição: ${PIX_INSTITUICAO}\n\n`;
  mensagem += `Envie aqui o comprovante após o pagamento.`;

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

