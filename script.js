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


/* ---------------------------------
   CARRINHO DA LOJA
---------------------------------- */
/***********************
 * ESTOQUE
 ***********************/
let estoquePadrao = {
  "Camiseta Rock na Praça": {
    Preta: { P: 5, M: 8, G: 3 },
    Branca: { P: 2, M: 4, G: 1 }
  }
};

let estoque = JSON.parse(localStorage.getItem("estoque")) || estoquePadrao;

/***********************
 * CARRINHO
 ***********************/
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

/***********************
 * ADICIONAR PRODUTO
 ***********************/
function adicionarProduto(nome, preco) {
  const cor = document.getElementById("cor").value;
  const tamanho = document.getElementById("tamanho").value;

  if (!cor || !tamanho) {
    alert("Selecione a cor e o tamanho");
    return;
  }

  const disponivel = estoque[nome]?.[cor]?.[tamanho] || 0;

  if (disponivel <= 0) {
    alert("Produto esgotado nessa cor e tamanho");
    return;
  }

  const itemExistente = carrinho.find(item =>
    item.nome === nome &&
    item.cor === cor &&
    item.tamanho === tamanho
  );

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome,
      preco,
      cor,
      tamanho,
      quantidade: 1
    });
  }

  estoque[nome][cor][tamanho] -= 1;

  salvarCarrinho();
  salvarEstoque();
  mostrarCarrinho();
}

/***********************
 * MOSTRAR CARRINHO
 ***********************/
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
      <strong>${item.nome}</strong><br>
      <small>Cor: ${item.cor} | Tamanho: ${item.tamanho}</small><br>
      R$${item.preco.toFixed(2)} x ${item.quantidade}
      <button onclick="removerItem(${index})">X</button>
    `;
    lista.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  qtdEl.textContent = quantidadeTotal;
}

/***********************
 * REMOVER ITEM
 ***********************/
function removerItem(index) {
  const item = carrinho[index];

  estoque[item.nome][item.cor][item.tamanho] += item.quantidade;

  carrinho.splice(index, 1);

  salvarCarrinho();
  salvarEstoque();
  mostrarCarrinho();
}

/***********************
 * LIMPAR CARRINHO
 ***********************/
function limparCarrinho() {
  carrinho.forEach(item => {
    estoque[item.nome][item.cor][item.tamanho] += item.quantidade;
  });

  carrinho = [];
  localStorage.removeItem("carrinho");

  salvarEstoque();
  mostrarCarrinho();
}

/***********************
 * SALVAR
 ***********************/
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function salvarEstoque() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
}

/***********************
 * ATUALIZAR TAMANHOS
 ***********************/
function atualizarTamanhos(nome, cor) {
  const selectTamanho = document.getElementById("tamanho");
  selectTamanho.innerHTML = '<option value="">Tamanho</option>';

  if (!estoque[nome] || !estoque[nome][cor]) return;

  Object.entries(estoque[nome][cor]).forEach(([tamanho, qtd]) => {
    const opt = document.createElement("option");
    opt.value = tamanho;
    opt.textContent = `${tamanho} ${qtd === 0 ? "(Esgotado)" : ""}`;
    opt.disabled = qtd === 0;
    selectTamanho.appendChild(opt);
  });
}

/***********************
 * WHATSAPP
 ***********************/
function enviarWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "*Meu pedido Rock na Praça:*\n\n";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome}
Cor: ${item.cor} | Tam: ${item.tamanho}
x${item.quantidade} - R$${(item.preco * item.quantidade).toFixed(2)}\n\n`;
  });

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  mensagem += `*Total:* R$${total.toFixed(2)}`;

  const numeroWhatsApp = "555196506622";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

/***********************
 * INIT
 ***********************/
document.addEventListener("DOMContentLoaded", mostrarCarrinho);



