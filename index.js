const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configurar a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'controle_estoque'
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Endpoint para executar o script SQL
app.get('/executar-script', (req, res) => {
  const scriptPath = path.join(__dirname, 'script.sql');
  const script = fs.readFileSync(scriptPath, 'utf-8');

  connection.query(script, (err, results) => {
    if (err) {
      console.error('Erro ao executar o script SQL:', err);
      res.status(500).send('Erro ao executar o script SQL.');
      return;
    }
    res.send('Script SQL executado com sucesso.');
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Fechar a conexão ao encerrar o servidor
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Erro ao encerrar a conexão com o banco de dados:', err);
    } else {
      console.log('Conexão com o banco de dados encerrada.');
    }
    process.exit(err ? 1 : 0);
  });
});
