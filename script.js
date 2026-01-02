 /*=====CABECALHO=====*/
  const btnHamburguer = document.getElementById("menu-hamburguer");
  const menu = document.getElementById("menu");

  btnHamburguer.addEventListener("click", () => {
    menu.classList.toggle("abrir");
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


/* ===============================
   LOJA
================================ */

const PIX_CHAVE = "rocknapracaesteio@gmail.com";
const PIX_NOME = "Ricardo Varela";
const PIX_INSTITUICAO = "Mercado Livre";
const WHATSAPP_NUMERO = "555192179735";


let carrinho = [];
let valorTotal = 0;



const listaItens = document.getElementById("itens");
const totalSpan = document.getElementById("total");
const quantidadeSpan = document.getElementById("quantidadeTotal");



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



document.querySelectorAll(".botao-adicionar").forEach(botao => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".card-loja");
    if (!card) return;

    const nome = card.dataset.nome;
    const preco = parseFloat(card.dataset.preco);

    if (!nome || isNaN(preco)) {
      alert("Produto inválido.");
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



function enviarWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "🛒 Pedido Rock na Praça\n\n";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome}`;
    if (item.tamanho && item.cor) {
      mensagem += ` (${item.tamanho} / ${item.cor})`;
    }
    mensagem += ` - R$ ${item.preco.toFixed(2)}\n`;
  });

  mensagem += `\nTotal: R$ ${valorTotal.toFixed(2)}\n\n`;
  mensagem += `Pagamento via PIX\n`;
  mensagem += `Chave: ${PIX_CHAVE}\n`;
  mensagem += `Nome: ${PIX_NOME}\n`;
  mensagem += `Instituição: ${PIX_INSTITUICAO}\n\n`;
  mensagem += `Envie o comprovante após o pagamento.`;

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    mensagem
  )}`;

  window.open(url, "_blank");
}


function abrirProduto(link) {
  const card = link.closest(".card-loja");
  if (!card) return;

  localStorage.setItem(
    "produtoSelecionado",
    JSON.stringify({
      nome: card.dataset.nome,
      preco: card.dataset.preco,
      descricao: card.dataset.descricao,
      imagens: card.dataset.imagens
    })
  );
}









