let tamanhoAtual = 100; // Começa em 100%

function alterarFonte(acao) {
    const html = document.documentElement;
    
    if (acao === 'aumentar' && tamanhoAtual < 130) {
        tamanhoAtual += 10; // Aumenta de 10% em 10%
    } else if (acao === 'diminuir' && tamanhoAtual > 80) {
        tamanhoAtual -= 10; // Diminui de 10% em 10%
    } else if (acao === 'resetar') {
        tamanhoAtual = 100;
    }
    
    html.style.fontSize = tamanhoAtual + '%';
}