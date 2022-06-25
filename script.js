
let mensagens = [];
let atualizarMensagens;
let usuario;
let mensagemEnviar;



function entrandoNaSala() {
    
    document.querySelector(".telaDeEntrada .entrar").classList.toggle("hidden");
    document.querySelector(".telaDeEntrada .entrando").classList.toggle("hidden");
    entrarSala();
}


function entrarSala () {

    clearInterval(atualizarMensagens);

    const nome = document.querySelector(".telaDeEntrada input").value;

    usuario = {
        name: nome
    }

    enviarPedido();
}


function enviarPedido() {
    const pedido = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    pedido.catch(tratarErro);
    pedido.then(buscarMensagens);
}


function tratarErro(erro) {
    if (erro.response.status === 400) {
        alert("Já há um usuário online com esse nome. Por favor, insira outro.");
        return;
    }
    alert("Ocorreu um erro. Por favor, tente novamente.")
}


function buscarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    setInterval(() => {axios.post("https://mock-api.driven.com.br/api/v6/uol/status", ({name: usuario.name}))}, 5000);
    promise.catch(recarregarPagina);
    promise.then(armazenarMensagens);
}


function armazenarMensagens(dados) {
    mensagens = dados.data;

    removerTelaInicial();
    renderizarMensagens();
}


function removerTelaInicial() {
    document.querySelector(".telaDeEntrada").classList.add("hidden");
}


function renderizarMensagens() {
    let ul = document.querySelector(".chat ul");
    let mensagem;
    let type;
    ul.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {

        mensagem = mensagens[i];
        type = mensagem.type;

        ul.innerHTML += mensagemTemplate(mensagem, type, i);
    }

    document.querySelector(".chat .ultimaMsg").scrollIntoView();

    buscarMensagens();
    //atualizarMensagens = setInterval(buscarMensagens, 3000);
}


function mensagemTemplate(mensagem, type, index) {
    if (index === 99) {
        if (type === "status") {
            return `
            <li class = "mensagem-status ultimaMsg">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> ${mensagem.text}</h1>
            </li>`
        }
    
        if (type === "message") {
            return `
            <li class = "mensagem-publica ultimaMsg">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
            </li>`
        }
    
        if (type === "private_message") {
            return `
            <li class = "mensagem-particular ultimaMsg">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> reservadamente para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
            </li>`
        }
    }

    if (type === "status") {
        return `
        <li class = "mensagem-status">
            <p>(${mensagem.time})</p>
            <h1><b>${mensagem.from}</b> ${mensagem.text}</h1>
        </li>`
    }

    if (type === "message") {
        return `
        <li class = "mensagem-publica">
            <p>(${mensagem.time})</p>
            <h1><b>${mensagem.from}</b> para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
        </li>`
    }

    if (type === "private_message") {
        return `
        <li class = "mensagem-particular">
            <p>(${mensagem.time})</p>
            <h1><b>${mensagem.from}</b> reservadamente para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
        </li>`
    }
}


function enviarMensagem() {

    msgDigitada = document.querySelector(".campo-inferior textarea").value;

    mensagemEnviar = {
        from: usuario.name,
        to: "Todos",
        text: msgDigitada,
        type: "message"
    };
    
    let solicitacao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnviar);
    solicitacao.catch(recarregarPagina);
    solicitacao.then(buscarMensagens);
}


function recarregarPagina(erro) {
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
}