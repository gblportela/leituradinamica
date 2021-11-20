const inputText = document.getElementById('input-text')
const btnInputText = document.getElementById('btn-input-text')
const btnLimparText = document.getElementById('btn-limpar-text')
const lendoDivArea = document.getElementsByClassName('ler-div')
const caixaLendo = document.querySelector('#caixa-lendo')
const lendoTextArea = document.getElementById('lendo-p')
const ppmContainer = document.querySelector('[ppm-container]')
const opcoesLateraisEls = document.querySelectorAll('[op-el]')
const spotlight = document.querySelector('[spotlight]')
const sombra = document.getElementById('sombra')
const logTexto = document.querySelector('[log-texto]')
const setasContainer = document.querySelector('.setas-container')
const caixaInput = document.getElementById('caixa-input')
const btnFS = document.getElementById("btn-FS");
const rodape = document.querySelector('.rodape')
let ppmText = document.querySelector('[ppm-text]')
let textFromInput = ""
let ppm = 400
let velocidade = 60000 / ppm
ppmText.innerText = `${ppm}ppm`
let words = []
let stop = false

function is_touch_device() {  
    try {  
      document.createEvent("TouchEvent");  
      return true;  
    } catch (e) {  
      return false;  
    }  
  }


document.querySelectorAll('[alterar-ppm-btn]').forEach(
    (btn) =>{
        btn.onclick = () => {
            alterarPpm(btn.getAttributeNode('alterar-ppm-btn').value)
        }
    }
)

function alterarPpm(fator){
    if(fator == "aumentar"){
        ppm += 10
    } else if(ppm > 160){
        ppm -= 10
    }
    velocidade = 60000 / ppm
    ppmText.innerText = `${ppm}ppm`
}

btnFS.onclick = () => {
    if(document.fullscreenElement) {
        document.exitFullscreen()
        .catch((err) => console.error(err))
        btnFS.innerText = 'Tela cheia'
    } else{
        document.documentElement.requestFullscreen()
        btnFS.innerText = 'Desativar tela cheia'
    }
}

btnInputText.onclick = () => {
    if(inputText.value !== ""){
        textFromInput = inputText.value
        caixaInput.style.display = "none"   
        lendo()
    }
}
btnLimparText.onclick = () => {
    inputText.value = ""
}
const removerArrayVazio = (caractere) => caractere !== ""

function lendo(){
    stop = false
    
    const RemoverQuebraDelinha = word =>{
        word = word.split("\n")
        if(word.length <= 1){
            return word
        } else{
            return word.join(" ")
        }
    }
    let words = textFromInput.split(" ").map(RemoverQuebraDelinha).join(" ").split(" ").filter(removerArrayVazio)

    lendoDivArea[0].setAttribute('tela', 'ativar')
    caixaLendo.style.display = "block"
    sombra.style.backgroundColor = "rgba(0, 0, 0, 0.849)"
    spotlight.setAttribute('spotlight', 'on')
    logTexto.setAttribute('log-texto', 'lendo')
    opcoesLateraisEls[2].style.display = "block"
    opcoesLateraisEls.forEach(e => e.setAttribute('op-el','lendo'))
    rodape.style.display = 'none'

    if(is_touch_device()){
        setasContainer.style.display = "block"
    }

    document.querySelectorAll('[seta]').forEach(e =>{
        e.ontouchstart = () =>{
            if(e.getAttributeNode('seta').value === "direita"){
                rightDown = true
            }else{
                leftDown = true
            }        
        }
        e.ontouchend = () => {
            if(e.getAttributeNode('seta').value === "esquerda"){
                leftDown = false
            }else{
                rightDown = false
            }
        }
    })

    let rightDown = false
    let leftDown = false
    let arrowUpReleased = true
    let arrowDownReleased = true

    let ultimaPalavra = 0
    logTexto.innerText = ''
    logTexto.style.opacity = "0"
    lendoTextArea.innerText = ''

    let i = -1
    
    document.onkeydown = (e) => {
        const keyDown = e.code
        const nextWord = teclasAceitasDown[keyDown]
        if(nextWord){
            nextWord()
        }
    }
    document.onkeyup = (e) => {
        const keyUp = e.code
        const stopWords = teclasAceitasUp[keyUp]
        if(stopWords){
            stopWords()
        }
    }
    teclasAceitasDown = {
        ArrowRight(){
            rightDown = true
        },
        ArrowLeft(){
            leftDown = true
        },
        ArrowUp(){
            if(arrowUpReleased){
                arrowUpReleased = false
                mudaPalavra("esquerda")
            }
        },
        ArrowDown(){
            if(arrowDownReleased){
                arrowDownReleased = false
                mudaPalavra("direita")
            }
        }
    }
    teclasAceitasUp = {
        ArrowRight(){
            rightDown = false
        },
        ArrowLeft(){
            leftDown = false
        },
        ArrowUp(){
            arrowUpReleased = true
        },
        ArrowDown(){
            arrowDownReleased = true
        }
    }
    function mudaPalavra(direcao){
        direcoesAceitas = {
            direita(){
                if(i + 1 < words.length){
                    i++
                    if(i > ultimaPalavra || ultimaPalavra === 0){
                        logTexto.innerText += `${words[i]}\xa0`
                        ultimaPalavra = i
                    }
                    lendoTextArea.innerText = words[i]
                } else if(i >= words.length){
                    lendoTextArea.innerText = "FIM DO TEXTO"
                } else{
                    lendoTextArea.innerText = "FIM DO TEXTO"
                    i++
                }
                
            },
            esquerda(){
                if(i > 0){
                    i--
                    lendoTextArea.innerText = words[i]   
                }
                else if(i < 0){
                    lendoTextArea.innerText = "INÍCIO DO TEXTO"
                }
                else{
                    lendoTextArea.innerText = "INÍCIO DO TEXTO"
                    i--
                } 
                console.log(i)
                
            }
        }
        const mudarPalavra = direcoesAceitas[direcao]
        if(mudarPalavra){
            mudarPalavra()
        }
    }
    const intervalo = (callback) => {
        setTimeout(() => {
            if(rightDown) {
                mudaPalavra("direita")
                document.querySelector("[log-texto]").scrollTo(0, document.querySelector("[log-texto]").scrollHeight);
                document.querySelector("[log-texto]").style.opacity = 0
            }else if(logTexto.innerText !== ''){
                document.querySelector("[log-texto]").style.opacity = 1
            }
            if(leftDown){
                mudaPalavra("esquerda")
            }
            if(stop === false){
                intervalo(callback)
            }
        }, velocidade);
    }
    intervalo(intervalo)

}

function voltarInicio(){
    stop = true
    opcoesLateraisEls.forEach(e => e.setAttribute('op-el',''))
    spotlight.setAttribute('spotlight', '')
    sombra.style.backgroundColor = "rgba(0, 0, 0, 0)"
    setasContainer.style.display = "none"
    logTexto.setAttribute('log-texto', '')
    caixaLendo.style.display = "none"
    caixaInput.style.display = "block"
    opcoesLateraisEls[2].style.display = "none"
    rodape.style.display = 'block'
}