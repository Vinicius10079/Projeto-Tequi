document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cnpj = document.getElementById('cnpj').value;
        const nome = document.getElementById('nome').value;
        const contatoPrincipal = document.getElementById('contatoPrincipal').value;
        const senha = document.getElementById('senha').value;

        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cnpj, nome, contatoPrincipal, senha })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = 'abertura_de_chamado.html';
        } else {
            alert(result.error);
        }
    });
});
