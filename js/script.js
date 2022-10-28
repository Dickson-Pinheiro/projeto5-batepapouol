let mensagens = [];
let user = {name: ""}
const mensagensElement = document.querySelector('.mensagens')
const botaoEnviarMensagem = document.querySelector("button")
const inputText = document.querySelector("input[type='text']")

function entrarNaSala(){
    let nome = prompt("Qual o seu lindo nome?")
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nome})
    .then(() => {
        user.name = nome
    })
    .catch(()=>{
        entrarNaSala()
        return;
    })
    return; 
}

entrarNaSala()

function buscarMensagens(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then((response) =>{
        mensagens = response.data;
        renderizarMensagens()
        let todasAsMensagens = document.querySelectorAll(".mensagem")
        let ultimaMensagem = todasAsMensagens[todasAsMensagens.length - 1]
        posicionarPagina(ultimaMensagem)
    })
}

setInterval(buscarMensagens, 3000)
setInterval(manterConectado, 5000)

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
                if(mensagem.from === user.name)
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

function manterConectado(){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user)
    promise.then(() => console.log("ainda está logado"))
    promise.catch(()=> window.location.reload())
}

botaoEnviarMensagem.addEventListener("click", enviarMensagem)
inputText.addEventListener("keypress", enviarMensagemEnter)

function enviarMensagem(){
    let inputText = document.querySelector("input[type='text']")
    let mensagem = {
        from: user.name,
        to: "todos",
        text: inputText.value,
        type: "message"
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem)
    .then(() => inputText.value="")
    .catch(() => {
        window.location.reload()
    })
}

function enviarMensagemEnter(e){
    if(e.key === "Enter"){
        enviarMensagem()
    }
}