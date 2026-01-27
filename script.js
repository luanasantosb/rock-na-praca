/*=====CABECALHO=====*/

 const btnMenu = document.getElementById("menu-hamburguer");
const menu = document.getElementById("menu");
const submenuToggle = document.querySelector(".menu-toggle");
const submenu = document.querySelector(".submenu");

btnMenu.addEventListener("click", () => {
  menu.classList.toggle("abrir");

  const aberto = menu.classList.contains("abrir");
  btnMenu.setAttribute("aria-expanded", aberto);
});


submenuToggle.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    const isOpen = submenu.classList.toggle("submenu-mobile");

    submenuToggle.setAttribute("aria-expanded", isOpen);
  }
});


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

  
 /*======  CONTADORES ===========*/

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

/*====== YOUTUBE ============*/

const container = document.getElementById("videos-lateral");
const PROXY_URL = "https://script.google.com/macros/s/AKfycbwU9oCYvnZGm2B68_Nbse5k4-MJ72iPC_vLSXktqPx0NAc73ZvvaYEhFnarmUSc6m5W/exec";

async function carregarVideos() {
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

    data.items.forEach(video => {
      const videoId = video.id.videoId;
      const snippet = video.snippet;

      const card = document.createElement("div");
      card.className = "cartao-video";

      card.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${snippet.thumbnails.medium.url}" alt="${snippet.title}">
          <h4>${snippet.title}</h4>
        </a>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar vídeos:", error);
    container.innerHTML = "<p>Não foi possível carregar os vídeos.</p>";
  }
}

carregarVideos();


/*====== MODAL ========= */

  function abrirMapa() {
    document.getElementById("modalMapa").classList.add("ativo");
  }

  function fecharMapa() {
    document.getElementById("modalMapa").classList.remove("ativo");
  }

/*==============    LOJA ================ */

const PIX_CHAVE = "83161163087";
const PIX_NOME = "Ricardo Varela";
const PIX_INSTITUICAO = "Pag Bank";
const WHATSAPP_NUMERO = "555192179735";

const STORAGE_KEY = "carrinhoRNP";

const quantidadeSpan = document.getElementById("quantidadeTotal");
const totalSpan = document.getElementById("total");
const btnLimpar = document.getElementById("btnLimpar");
const btnFinalizar = document.getElementById("btnFinalizar");

// 📥 Ler carrinho salvo
function carregarCarrinho() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


function atualizarCarrinho() {
  const carrinho = carregarCarrinho();

  const quantidade = carrinho.length;
  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  quantidadeSpan.textContent = quantidade;
  totalSpan.textContent = total.toFixed(2);
}


document.addEventListener("DOMContentLoaded", atualizarCarrinho);


btnLimpar.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  atualizarCarrinho();
});


btnFinalizar.addEventListener("click", () => {
  const carrinho = carregarCarrinho();

  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  let mensagem = "Meu pedido Rock na Praça:\n";

  carrinho.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome}`;
    if (item.tamanho) mensagem += ` (${item.tamanho})`;
    if (item.cor) mensagem += ` - ${item.cor}`;
    mensagem += ` - R$ ${item.preco.toFixed(2)}\n`;
  });

  const total = carrinho.reduce((soma, i) => soma + i.preco, 0);
  mensagem += `Total: R$ ${total.toFixed(2)}\n Efetue o pagamento para chave pix ${PIX_CHAVE}\n Nome ${PIX_NOME},\n Banco ${PIX_INSTITUICAO} e envie seu comprovante aqui`;

  const telefone = "555192179735";
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
});

