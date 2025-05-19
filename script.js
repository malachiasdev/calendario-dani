const form = document.getElementById('form');
    const mensagem = document.getElementById('mensagem');

    const frases = [
      "Parabéns! Sei que você está se cuidando. Tenho muito orgulho ❤",
      "Você é muito linda por se cuidar! 💕",
      "Tenho muito orgulho de você 💖",
      "Te amo! Continue firme 💪",
      "Cuidar de si também é um ato de amor 💗"
    ];

    const salvarHorarios = (dados) => {
      localStorage.setItem('lembretes', JSON.stringify(dados));
    };

    const carregarHorarios = () => {
      return JSON.parse(localStorage.getItem('lembretes')) || {};
    };

    const pedirPermissao = async () => {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    };

    const agendarNotificacoes = (dados) => {
      const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
      const agora = new Date();

      diasSemana.forEach((dia, i) => {
        const hora = dados[dia];
        if (!hora) return;

        const [h, m] = hora.split(":").map(Number);
        const hoje = new Date();
        hoje.setDate(agora.getDate() + ((i - agora.getDay() + 7) % 7));
        hoje.setHours(h, m, 0, 0);

        const delay = hoje - agora;

        if (delay > 0) {
          setTimeout(() => {
            mostrarNotificacao();
          }, delay);
        }
      });
    };

    const mostrarNotificacao = () => {
      if (Notification.permission === 'granted') {
        const notif = new Notification("Dani, hora de tomar seu remédio!", {
          body: "Clique para confirmar",
        });

        notif.onclick = () => {
          const frase = frases[Math.floor(Math.random() * frases.length)];
          mensagem.innerText = frase;
        };
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const dados = Object.fromEntries(formData.entries());
      salvarHorarios(dados);
      await pedirPermissao();
      agendarNotificacoes(dados);
      mensagem.innerText = "Lembretes salvos com sucesso!";
    });

    window.onload = () => {
      const dados = carregarHorarios();
      Object.keys(dados).forEach((dia) => {
        const input = form.elements[dia];
        if (input) input.value = dados[dia];
      });
      agendarNotificacoes(dados);
    };