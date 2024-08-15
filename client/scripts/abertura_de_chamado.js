document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chamadoForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cnpj = document.getElementById('cnpj').value;
        const senha = document.getElementById('senha').value;
        const descricao = document.getElementById('descricao').value;
        const chamados = Array.from(document.querySelectorAll('input[name="chamados"]:checked')).map(el => el.value);

        const response = await fetch('/abertura_de_chamado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cnpj, senha, chamados, descricao })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.error);
        }
    });
});
