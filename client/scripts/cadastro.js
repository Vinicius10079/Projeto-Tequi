document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const CNPJ = document.getElementById('CNPJ').value;
    const Nome = document.getElementById('Nome').value;
    const ContatoPrincipal = document.getElementById('ContatoPrincipal').value;
    const Senha = document.getElementById('Senha').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CNPJ, Nome, ContatoPrincipal, Senha })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});
