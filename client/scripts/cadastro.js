document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const CNPJ = document.getElementById('cnpj').value;
    const Nome = document.getElementById('nome').value;
    const ContatoPrincipal = document.getElementById('contatoPrincipal').value;
    const Senha = document.getElementById('password').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CNPJ, Nome, ContatoPrincipal, Senha })
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Cadastro bem-sucedido') {
            alert(data);
            window.location.href = 'abertura_de_chamado.html';
        } else {
            alert(data);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
