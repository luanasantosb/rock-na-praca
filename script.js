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