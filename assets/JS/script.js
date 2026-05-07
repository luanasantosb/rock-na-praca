/*===== CABECALHO mobile =====*/

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

/*============== LOJA ================*/

const STORAGE_KEY = "carrinhoRNP";

const secaoCarrinho = document.getElementById("secaoCarrinho");
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

  carrinho.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrinho");

    div.innerHTML = `
      <p>
        <strong>${item.nome}</strong><br>
        Quantidade: 1<br>
        Valor unitário: R$ ${Number(item.preco).toFixed(2)}<br>
        Subtotal: R$ ${Number(item.preco).toFixed(2)}
      </p>
    `;

    listaCarrinho.appendChild(div);
  });
}

function atualizarCarrinho() {
  const carrinho = carregarCarrinho();

  if (secaoCarrinho) {
    if (carrinho.length > 0) {
      secaoCarrinho.classList.remove("oculto");
    } else {
      secaoCarrinho.classList.add("oculto");
    }
  }

  if (quantidadeSpan) {
    quantidadeSpan.textContent = carrinho.length;
  }

  if (totalSpan) {
    const total = carrinho.reduce((soma, item) => soma + Number(item.preco), 0);
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

    let mensagem = "Meu pedido Rock na Praça:\n\n";

    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.nome} - R$ ${Number(item.preco).toFixed(2)}\n`;
    });

    const total = carrinho.reduce((soma, item) => soma + Number(item.preco), 0);

    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

    const telefone = "555192179735";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
  });
}

//card com contador

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


