const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Configurar o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, '../client')));

app.use(express.json());

// Rotas para lidar com as operações do banco de dados
app.post('/login', (req, res) => {
    const { CNPJ, Senha } = req.body;
    let db = new sqlite3.Database(path.join(__dirname, '../database/banco_de_dados_tequi.db'), sqlite3.OPEN_READONLY);
    
    db.get('SELECT * FROM CadastroEmpresas WHERE CNPJ = ? AND Senha = ?', [CNPJ, Senha], (err, row) => {
        if (err) {
            res.status(500).send('Erro no servidor');
        } else if (row) {
            res.send('Login bem-sucedido');
        } else {
            res.status(401).send('CNPJ ou Senha incorretos');
        }
        db.close();
    });
});

app.post('/register', (req, res) => {
    const { CNPJ, Nome, ContatoPrincipal, Senha } = req.body;
    let db = new sqlite3.Database(path.join(__dirname, '../database/banco_de_dados_tequi.db'), sqlite3.OPEN_READWRITE);
    
    db.get('SELECT * FROM CadastroEmpresas WHERE CNPJ = ?', [CNPJ], (err, row) => {
        if (err) {
            res.status(500).send('Erro no servidor');
        } else if (row) {
            res.status(400).send('CNPJ já cadastrado');
        } else {
            const DataCadastro = new Date().toISOString();
            db.run('INSERT INTO CadastroEmpresas (CNPJ, Nome, ContatoPrincipal, Senha, DataCadastro) VALUES (?, ?, ?, ?, ?)',
            [CNPJ, Nome, ContatoPrincipal, Senha, DataCadastro], function(err) {
                if (err) {
                    res.status(500).send('Erro ao cadastrar');
                } else {
                    res.send('Cadastro bem-sucedido');
                }
                db.close();
            });
        }
    });
});

app.post('/openTicket', (req, res) => {
    const { CNPJ, Senha, Chamados, DescricoesProblema } = req.body;
    let db = new sqlite3.Database(path.join(__dirname, '../database/banco_de_dados_tequi.db'), sqlite3.OPEN_READWRITE);

    db.get('SELECT * FROM CadastroEmpresas WHERE CNPJ = ? AND Senha = ?', [CNPJ, Senha], (err, row) => {
        if (err) {
            res.status(500).send('Erro no servidor');
        } else if (row) {
            const ContatoPrincipal = row.ContatoPrincipal;
            const DataChamado = new Date().toISOString();
            db.run('INSERT INTO ChamadosEmAberto (CNPJ, Nome, Chamados, DescricoesProblema, ContatoPrincipal, DataChamado) VALUES (?, ?, ?, ?, ?, ?)',
            [CNPJ, row.Nome, Chamados.join(','), DescricoesProblema, ContatoPrincipal, DataChamado], function(err) {
                if (err) {
                    res.status(500).send('Erro ao abrir chamado');
                } else {
                    res.send('Chamado aberto com sucesso');
                }
                db.close();
            });
        } else {
            res.status(401).send('CNPJ ou Senha incorretos');
        }
    });
});

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/login.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
