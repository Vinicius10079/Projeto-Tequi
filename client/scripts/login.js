document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cnpj = document.getElementById('cnpj').value;
        const senha = document.getElementById('senha').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cnpj, senha })
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = 'abertura_de_chamado.html';
        } else {
            alert(result.error);
        }
    });
});
