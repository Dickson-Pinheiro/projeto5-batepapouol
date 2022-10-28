let mensagens = [];
const mensagensElement = document.querySelector('.mensagens')

function buscarMensagens(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then((response) =>{
        mensagens = response.data;
        renderizarMensagens()
        let ultimaMensagem = document.querySelectorAll(".mensagem")[mensagens.length - 1]
        posicionarPagina(ultimaMensagem)
    })
}

buscarMensagens()
setTimeout(buscarMensagens, 3000)

function renderizarMensagens(){

    mensagensElement.innerHTML = ""

    mensagens.forEach(mensagem => {
        switch (mensagem.type) {
            case "status":
            mensagensElement.innerHTML += `
            <div class="mensagem status">
                <p><span>(${mensagem.time})</span><span class="bold">${mensagem.from}</span> ${mensagem.text}</p>
            </div>
             `
             break;
             case "message":
                mensagensElement.innerHTML+= `
                <div class="mensagem publico">
                <p><span>(${mensagem.time})</span><span class="bold">${mensagem.from}</span> para <span class="bold">${mensagem.to}</span>: ${mensagem.text}</p>
            </div>
                `
            break;
            case "private_message":
                mensagensElement.innerHTML+= `
                <div class="mensagem reservado">
                <p><span>(${mensagem.time})</span><span class="bold">${mensagem.from}</span> reservadamente para <span class="bold">${mensagem.to}</span>: ${mensagem.text}</p>
            </div>
                `
        }
    })
}

function posicionarPagina(element){
    element.scrollIntoView()
}