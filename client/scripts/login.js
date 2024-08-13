document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const CNPJ = document.getElementById('cnpj').value;
        const Senha = document.getElementById('password').value;
        
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CNPJ, Senha })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Adicionado para depuração
            if (data === 'Login bem-sucedido') {
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
});
