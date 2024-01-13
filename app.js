//Dependências
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//Inicializando ou usando as dependências
dotenv.config();
const app = express();
// Configurando o express para reconhecer JSON como padrão
app.use(express.json());
//Models do mongoose
import User from './models/user.js';

//Inicio dos códigos

// Open Route - Public Route /
app.get('/', (req, res) => {
  if (req.body.nome != 'Chris') {
    return res.status(400).json({
      erro: true,
      msg: `O nome enviado no json esta incorreto: ${req.body.nome}`,
    });
  }
  return res.status(200).json({
    erro: false,
    msg: 'Bem vindo a nossa API! ',
  });
});

// GET no End Point /auth/register *********************************************
app.get('/auth/register', (req, res) => {
  if (req.body.nome != 'Christiano Quintela') {
    return res.status(400).json({
      erro: true,
      msg: `Algo de errado não esta certo! `,
    });
  }
  return res.status(200).json({
    erro: false,
    msg: 'Bem vindo a rota /auth/register ',
  });
});

//POST no end point /auth/Register *********************************************
app.post('/auth/register', async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
//   console.log(name);
  //validations
  if (!name) {
    return res.status(422).json({
      erro: true,
      msg: `O nome é obrigatório. `,
    });
  }
  if (!email) {
    return res.status(422).json({
      erro: true,
      msg: `O email é obrigatório. `,
    });
  }
  if (!password) {
    return res.status(422).json({
      erro: true,
      msg: `O password é obrigatório. `,
    });
  }
  if (password !== confirmpassword) {
    return res.status(422).json({
      erro: true,
      msg: `Confirme o password ou digite corretamente. `,
    });
  } //fim ifs

  //Checando se o usuário existe


  //Resposta quando enviar um dado corretamente - evita o loop infinito no inmsonia.
  return res.status(200).json({
    erro: false,
    msg: 'Dados recebidos com sucesso! ',
  });
});

//Credencials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.rp5lmbr.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Conectou ao banco com sucesso!');
  })
  .catch((err) => console.log(err));

//Servidor iniciado na porta 8080, dados salvos no .env
app.listen(process.env.PORT, () => {
  const data = new Date();

  console.log('Servidor iniciado em http://localhost:8080 - ' + data);
});
