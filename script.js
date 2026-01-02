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
    LOJA
---------------------------------------*/
 let carrinho = [];

function adicionar(botao, nome, preco) {
  const card = botao.closest('.card-loja');

  if (!card) {
    alert('Erro: card não encontrado');
    return;
  }

  const tamanhoSelect = card.querySelector('select[name="tamanho"]');
  const corSelect = card.querySelector('select[name="cor"]');

  const tamanho = tamanhoSelect
    ? tamanhoSelect.options[tamanhoSelect.selectedIndex].text
    : 'Único';

  const cor = corSelect
    ? corSelect.options[corSelect.selectedIndex].text
    : 'Padrão';

  carrinho.push({ nome, preco, tamanho, cor });
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById('itens');
  const totalSpan = document.getElementById('total');
  const quantidadeSpan = document.getElementById('quantidadeTotal');

  lista.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.nome}</strong><br>
      <small>Tam: ${item.tamanho} | Cor: ${item.cor}</small><br>
      R$ ${item.preco.toFixed(2)}
      <button onclick="removerItem(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2);
  quantidadeSpan.textContent = carrinho.length;
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

function enviarWhatsApp() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  let mensagem = '🛒 *Pedido Rock Na Praça*%0A%0A';
  let total = 0;

  carrinho.forEach((item, i) => {
    mensagem += `${i + 1}. ${item.nome}%0A`;
    mensagem += `Tam: ${item.tamanho}%0A`;
    mensagem += `Cor: ${item.cor}%0A`;
    mensagem += `R$ ${item.preco.toFixed(2)}%0A%0A`;
    total += item.preco;
  });

  mensagem += `💰 *Total: R$ ${total.toFixed(2)}*`;

  window.open(
    `https://wa.me/5511999999999?text=${mensagem}`,
    '_blank'
  );
}









