const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../database/banco_de_dados_tequi.db');

// Função para abrir a conexão com o banco de dados
function openDatabaseConnection() {
    return new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });
}

// Encerrando a conexão com o banco de dados
function closeDatabaseConnection(db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

// Função para cadastro
app.post('/register', (req, res) => {
    const { CNPJ, Nome, ContatoPrincipal, Senha } = req.body;
    const DataCadastro = new Date().toISOString();

    const db = openDatabaseConnection();
    db.run(`INSERT INTO CadastroEmpresas (CNPJ, Nome, ContatoPrincipal, Senha, DataCadastro) VALUES (?, ?, ?, ?, ?)`, 
    [CNPJ, Nome, ContatoPrincipal, Senha, DataCadastro], function(err) {
        if (err) {
            res.status(400).send('Erro ao cadastrar empresa: ' + err.message);
        } else {
            res.send('Empresa cadastrada com sucesso.');
        }
        closeDatabaseConnection(db);
    });
});

// Função de login
app.post('/login', (req, res) => {
    const { CNPJ, Senha } = req.body;

    const db = openDatabaseConnection();
    db.get(`SELECT * FROM CadastroEmpresas WHERE CNPJ = ? AND Senha = ?`, [CNPJ, Senha], (err, row) => {
        if (err) {
            res.status(400).send('Erro ao fazer login: ' + err.message);
        } else if (row) {
            res.send('Login bem-sucedido.');
        } else {
            res.status(400).send('CNPJ ou senha incorretos.');
        }
        closeDatabaseConnection(db);
    });
});

// Função para abrir chamado
app.post('/openTicket', (req, res) => {
    const { CNPJ, Senha, Chamados, DescricoesProblema } = req.body;
    const DataChamado = new Date().toISOString();

    const db = openDatabaseConnection();
    db.get(`SELECT * FROM CadastroEmpresas WHERE CNPJ = ? AND Senha = ?`, [CNPJ, Senha], (err, row) => {
        if (err) {
            res.status(400).send('Erro ao verificar CNPJ: ' + err.message);
        } else if (!row) {
            res.status(400).send('CNPJ ou senha incorretos.');
        } else {
            db.run(`INSERT INTO ChamadosEmAberto (CNPJ, Nome, Chamados, DescricoesProblema, ContatoPrincipal, DataChamado) VALUES (?, ?, ?, ?, ?, ?)`,
            [CNPJ, row.Nome, Chamados, DescricoesProblema, row.ContatoPrincipal, DataChamado], function(err) {
                if (err) {
                    res.status(400).send('Erro ao abrir chamado: ' + err.message);
                } else {
                    res.send('Chamado aberto com sucesso.');
                }
                closeDatabaseConnection(db);
            });
        }
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
