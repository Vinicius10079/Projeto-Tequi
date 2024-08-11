document.getElementById('ticketForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const CNPJ = document.getElementById('CNPJ').value;
    const Senha = document.getElementById('Senha').value;
    const Chamados = Array.from(document.querySelectorAll('input[name="Chamados"]:checked')).map(cb => cb.value);
    const DescricoesProblema = document.getElementById('DescricoesProblema').value;

    fetch('/openTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CNPJ, Senha, Chamados, DescricoesProblema })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});
