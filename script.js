
let mensagens = [];

buscarMensagens();

function buscarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(armazenarMensagens);
}


function armazenarMensagens(dados) {
    mensagens = dados.data;
    renderizarMensagens();
}


function renderizarMensagens() {
    let ul = document.querySelector(".chat ul");
    let mensagem;
    let tipoMensagem;
    let type;

    for (let i = 0; i < mensagens.length; i++) {

        mensagem = mensagens[i];
        type = mensagem.type;

        if (type === "status") {
            tipoMensagem = 'mensagem-status';

            ul.innerHTML += `
            <li class = "${tipoMensagem}">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> ${mensagem.text}</h1>
            </li>`
        }

        else {

            if (type === "message") {
                tipoMensagem = 'mensagem-publica';
            }
            if (type === "private_message") {
                tipoMensagem = 'mensagem-particular';
            }

            ul.innerHTML += `
            <li class = "${tipoMensagem}">
                <p>(${mensagem.time})</p>
                <h1><b>${mensagem.from}</b> para <b>${mensagem.to}</b>: ${mensagem.text}</h1>
            </li>`
        }
    }
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