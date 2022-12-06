const BASE_URL = "https://mock-api.driven.com.br/api/v6/uol";
let destinatario = "Todos";
let tipoMensagem = "message";
let mensagens = [];
const usuario = {};
let mensagemEnviar;
let usuariosAtivos;

function entrarSala() {
	document.querySelector(".telaDeEntrada .entrar").classList.toggle("hidden");
	document.querySelector(".telaDeEntrada .entrando").classList.toggle("hidden");

	usuario.name = document.querySelector(".telaDeEntrada input").value;

	enviarPedido();
	enviarMensagemEnter();
}

function enviarPedido() {
	axios
		.post(`${BASE_URL}/participants`, usuario)
		.catch(tratarErro)
		.then(manterConexao);
}

function tratarErro(erro) {
	if (erro.response.status === 400) {
		alert("Já existe um usuário online com esse nome. Por favor, insira outro.");
		return recarregarPagina();
	}
	alert("Ocorreu um erro. Por favor, tente novamente.");
	recarregarPagina();
}

function manterConexao() {
	setInterval(() => {
		axios.post(`${BASE_URL}/status`, usuario);
	}, 5000);

	atualizarMensagens();
}

function atualizarMensagens() {
	setInterval(buscarMensagens, 3000);
}

function buscarMensagens() {
	const promise = axios.get(`${BASE_URL}/messages`);

	promise.catch(tratarErro);
	promise.then(armazenarMensagens);
}

function armazenarMensagens(dados) {
	mensagens = dados.data;
	usuariosAtivos = dados.data;

	removerTelaInicial();
	renderizarMensagens();
	renderizarUsuarios();
}

function removerTelaInicial() {
	document.querySelector(".telaDeEntrada").classList.add("hidden");
}

function renderizarMensagens() {
	let ul = document.querySelector(".chat ul");
	let mensagem;
	let type;
	ul.innerHTML = "";

	for (let i = 0; i < mensagens.length; i++) {
		mensagem = mensagens[i];
		type = mensagem.type;

		ul.innerHTML += mensagemTemplate(mensagem, type, i);
	}

	document.querySelector(".chat .ultimaMsg").scrollIntoView();
}

function renderizarUsuarios() {
	let ul = document.querySelector(".aba-lateral .usuarios-ativos");
	let participantes = [];

	ul.innerHTML = `
        <li onclick="configurarMensagem(this)">
            <div>
                <ion-icon name="people"></ion-icon>
                <h3>Todos</h3>
            </div>
            <ion-icon class="escolhido check" name="checkmark-outline"></ion-icon>
        </li>
    `;

	for (let i = 0; i < usuariosAtivos.length; i++) {
		let participante = usuariosAtivos[i];

		if (
			participante.type !== "status" &&
			!participantes.includes(participante.from)
		) {
			participantes.push(participante);

			ul.innerHTML += `
                <li onclick="configurarMensagem(this)">
                <div>
                    <ion-icon name="person-circle"></ion-icon>
                    <h3>${participante.from}</h3>
                </div>
                <ion-icon class="check" name="checkmark-outline"></ion-icon>
                </li>
            `;
		}
	}
}

function mensagemTemplate(mensagem, type, index) {
	if (index === 99) {
		if (type === "status") {
			return `
            <li class = "mensagem-status ultimaMsg">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> ${mensagem.text}</h1>
            </li>`;
		}

		if (type === "message") {
			return `
            <li class = "mensagem-publica ultimaMsg">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
            </li>`;
		}

		if (type === "private_message") {
			return `
            <li class = "mensagem-particular ultimaMsg">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> reservadamente para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
            </li>`;
		}
	}

	if (type === "status") {
		return `
        <li class = "mensagem-status">
            <p>(${mensagem.time})</p>
            <h1><b>${mensagem.from}</b> ${mensagem.text}</h1>
        </li>`;
	}

	if (type === "message") {
		return `
        <li class = "mensagem-publica">
            <p>(${mensagem.time})</p>
            <h1><b>${mensagem.from}</b> para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
        </li>`;
	}

	if (type === "private_message") {
		return `
        <li class = "mensagem-particular">
            <p>(${mensagem.time})</p>
            <h1><b>${mensagem.from}</b> reservadamente para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
        </li>`;
	}
}

function enviarMensagemEnter() {
	document.addEventListener("keydown", function (tecla) {
		let teclaEnter = tecla.key === "Enter";
		let mensagemValida =
			document.querySelector(".campo-inferior textarea").value !== "";

		if (teclaEnter && mensagemValida) {
			enviarMensagem();
		}
	});
}

function enviarMensagem() {
	msgDigitada = document.querySelector(".campo-inferior textarea").value;

	mensagemEnviar = {
		from: usuario.name,
		to: destinatario,
		text: msgDigitada,
		type: tipoMensagem,
	};

	let solicitacao = axios.post(
		"https://mock-api.driven.com.br/api/v6/uol/messages",
		mensagemEnviar
	);
	solicitacao.catch(recarregarPagina);
	solicitacao.then(buscarMensagens);

	document.querySelector(".campo-inferior textarea").value = "";
}

function recarregarPagina() {
	window.location.reload();
}

function toggleBarraLateral() {
	let background = document.querySelector(".background-aba-lateral");
	background.classList.toggle("hidden");

	let barraLateral = document.querySelector(".aba-lateral");
	barraLateral.classList.toggle("aba-lateral-aberta");
}

function configurarMensagem(li) {
	let jaEscolhido = li.parentNode.querySelector(".escolhido");

	if (jaEscolhido !== li) {
		jaEscolhido.classList.remove("escolhido");
		li.querySelector(".check").classList.add("escolhido");
	}

	atualizarEstado(li);
}

function atualizarEstado(li) {
	let secaoUsuarios = document.querySelector(
		".usuarios-ativos .escolhido"
	).parentElement;
	let secaoVisibilidade = document.querySelector(
		".visibilidade .escolhido"
	).parentElement;

	destinatario = secaoUsuarios.querySelector("h3").innerHTML;

	tipoMensagem = secaoVisibilidade.querySelector("h3").innerHTML.toLowerCase();

	document.querySelector(
		".campo-inferior div p"
	).innerHTML = `Enviando para ${destinatario} (${tipoMensagem})`;

	if (tipoMensagem === "público") {
		tipoMensagem = "message";
		return;
	}
	tipoMensagem = "private_message";
}
