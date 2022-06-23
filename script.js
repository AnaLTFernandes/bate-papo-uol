

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