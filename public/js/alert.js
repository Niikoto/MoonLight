//fucao para alerta de erro de invalidacao
function alertaInvalidado() {
    mensagem = "Email ou senha invalidos";
    document.getElementsByClassName('mensa')[0].innerHTML = mensagem;
    const flashMessage = $('.alert');
    flashMessage.text(alertMessage);
}

//funcao para alerta de validacao
function alertaValido() {
    mensagem = "Email ou senha invalidos";
    document.getElementsByClassName('mensa').innerHTML = mensagem;    
    const flashMessage = $('.alert');
    flashMessage.text(alertMessage);
}