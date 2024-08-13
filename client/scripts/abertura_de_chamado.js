document.addEventListener('DOMContentLoaded', () => {
    const chamadoForm = document.getElementById('chamadoForm');
    
    if (!chamadoForm) {
        console.error('Formulário de chamado não encontrado');
        return;
    }

    chamadoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const tipoChamado = Array.from(document.querySelectorAll('input[name="tipoChamado"]:checked')).map(el => el.value);
        const descricaoProblema = document.getElementById('descricaoProblema').value;
        const cnpj = document.getElementById('cnpj').value;
        const senha = document.getElementById('password').value;

        const response = await fetch('/abertura_de_chamado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tipoChamado, descricaoProblema, cnpj, senha })
        });

        const result = await response.text();
        alert(result);
    });
});
