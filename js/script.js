let mensagens = [];
let user = {name: ""}
let message = {from:"" ,to: "todos", type: "message", text:""}
const mensagensElement = document.querySelector('.mensagens')
const botaoEnviarMensagem = document.querySelector("button")
const inputText = document.querySelector("input[type='text']")
const menu = document.querySelector(".buttonMenu")
const blur = document.querySelector(".menuLateral .blur")
const participantesAtivosBox = document.querySelector(".activePeople")
let positionPageEnd = false;

function entrarNaSala(){
    let nome = prompt("Qual o seu lindo nome?")
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nome})
    .then(() => {
        user.name = nome
        message.from = nome
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
                if(mensagem.to === "todos"){
                    mensagensElement.innerHTML+= `
                    <div class="mensagem publico">
                        <p><span>(${mensagem.time})</span><span class="bold">${mensagem.from}</span> para <span class="bold">${mensagem.to}</span>: ${mensagem.text}</p>
                    </div>
                    `
                } else {
                    mensagensElement.innerHTML+= `
                <div class="mensagem publico">
                <p><span>(${mensagem.time})</span><span class="bold">${mensagem.from}</span> para <span class="bold">${mensagem.to}</span>: ${mensagem.text}</p>
            </div>
                `
                }
                
            break;
            case "private_message":
                if(mensagem.from === user.name || mensagem.to === user.name){
                mensagensElement.innerHTML+= `
                <div class="mensagem reservado">
                <p><span>(${mensagem.time})</span><span class="bold">${mensagem.from}</span> reservadamente para <span class="bold">${mensagem.to}</span>: ${mensagem.text}</p>
            </div>
                `
                }
                break;
            default:
                break;
        }
    })
}

function posicionarPagina(element){
    if(!positionPageEnd){
        positionPageEnd = true;
        element.scrollIntoView()
    }
    
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
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {...message, text: inputText.value})
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


function buscarParticipantesAtivos(){
    axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    .then((response) => {
        let participants = response.data
        participantesAtivosBox.innerHTML = ""
        participantesAtivosBox.innerHTML = '<div class="people" onclick="addSelectionParticipants(this)"><img src="./images/icon-header.svg" /><p>Todos</p><ion-icon name="checkmark-outline" value="todos"></ion-icon></div>'
        participants.forEach(user => {
            participantesAtivosBox.innerHTML+= `
            <div class="people" onclick='addSelectionParticipants(this)'>
                <img src="./images/people.svg" />
                <p>${user.name}</p>
                <ion-icon name="checkmark-outline"></ion-icon>
            </div>
            `
        })
    })
}

buscarParticipantesAtivos()
setInterval(buscarParticipantesAtivos, 10000);

function addSelectionParticipants(element){
    let anterior = document.querySelector(".activePeople .selected")
    if(anterior){
        anterior.classList.remove("selected")
    }
        element.children[2].classList.add("selected")
        message.to = element.children[1].innerHTML
}

function addSelectionVisibilidade(element){
    let anterior = document.querySelector(".visibilidade .selected")
    if(anterior){
        anterior.classList.remove("selected")
    }
        element.children[2].classList.add("selected")
        if(element.children[1].innerHTML === "Público"){
            message.type = "message"
        } else {
            message.type= "private_message"
        }
}

menu.addEventListener("click", controleMenu)
blur.addEventListener("click", controleMenu)

function controleMenu(){
    let menuLateral = document.querySelector(".menuLateral")
    menuLateral.classList.toggle("showMenuLateral")
}
