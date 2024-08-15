const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

const dbPath = path.join(__dirname, '../database/banco_de_dados_tequi.db');

// Middleware para servir arquivos estáticos da pasta client
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

// Função para fechar o banco de dados
function closeDb(db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
}

// Servir a página principal (login) ao acessar a raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/login.html'));
});

app.post('/cadastro', (req, res) => {
    const { cnpj, nome, contatoPrincipal, senha } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        db.run(`INSERT INTO CadastroEmpresas (CNPJ, Nome, ContatoPrincipal, Senha, DataCadastro) VALUES (?, ?, ?, ?, date('now'))`, 
            [cnpj, nome, contatoPrincipal, senha], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                db.run(`INSERT INTO TabelaContatos (CNPJ, Nome, ContatoPrincipal, DataChamado) VALUES (?, ?, ?, date('now'))`, 
                    [cnpj, nome, contatoPrincipal], function(err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
                    });

                closeDb(db);
            });
    });
});

app.post('/login', (req, res) => {
    const { cnpj, senha } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.get(`SELECT * FROM CadastroEmpresas WHERE CNPJ = ? AND Senha = ?`, [cnpj, senha], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ error: 'CNPJ ou senha incorretos' });
        }
        closeDb(db);
    });
});

app.post('/abertura_de_chamado', (req, res) => {
    const { cnpj, senha, chamados, descricao } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.get(`SELECT * FROM CadastroEmpresas WHERE CNPJ = ? AND Senha = ?`, [cnpj, senha], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'CNPJ ou senha incorretos' });
        }

        const nomeEmpresa = row.Nome;
        const contato = row.ContatoPrincipal;

        db.run(`INSERT INTO ChamadosEmAberto (CNPJ, Nome, Chamados, DescricaoProblema, ContatoPrincipal, DataChamado) VALUES (?, ?, ?, ?, ?, date('now'))`, 
            [cnpj, nomeEmpresa, JSON.stringify(chamados), descricao, contato], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json({ message: 'Chamado aberto com sucesso!' });
                closeDb(db);
            });
    });
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
