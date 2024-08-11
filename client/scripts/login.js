document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const CNPJ = document.getElementById('CNPJ').value;
    const Senha = document.getElementById('Senha').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CNPJ, Senha })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});
