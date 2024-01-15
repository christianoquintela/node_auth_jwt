/* Dependências ***************************************************************************************************** */
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* Inicializando ou usando as dependências ************************************************************************** */
dotenv.config();
const app = express();

// Configurando o express para reconhecer JSON como padrão
app.use(express.json());

//Models do mongoose
import User from './models/user.js';

/* Inicio dos códigos <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

/* Open Route - Public Route **************************************************************************************** */
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

/* Closed Route - Private Route ************************************************************************************* */
/* Posso usar o midllewere em uma função aqui no corpo deste app.js ou uma importação. */
//Importação: import checkToken from './midllewere/midllewere.js';
//Teria que passar como parametro o token, req, res, next

app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  //Check if user exists
  const user = await User.findById(id, '-password');
  // console.log(user);
  if (!user) {
    return res.status(404).json({
      erro: true,
      msg: `Usuário não encontrado. `,
    });
  }

  return res.status(200).json({ user });
});

/* GET no End Point /auth/register ********************************************************************************** */
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

/* POST no end point /auth/Register ********************************************************************************* */
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

  //Checando se o usuário existe, usamos o email para ver se já esta cadastrado.
  const userExists = await User.findOne({ email: email });
  if (userExists)
    return res.status(422).json({
      erro: true,
      msg: `E-mail informado já esta sendo utilizado. `,
    });

  /* Create password -> para isso vamos utilizar o bcryptjs para adicionar mais 
  segurança.
  - Estudar mais sobre as funções do bcrypt a seguir:
  bcrypt.compare
  bcrypt.compareSync
  bcrypt.genSalt
  bcrypt.genSaltSync
  bcrypt.getHounds
  bcrypt.hash
  bcrypt.hashSync
  */
  //Create password
  const salt = await bcrypt.genSalt(12);
  //password vindo do post, depois da validação, salt acima criado para aumentar a criptografia.
  const passwordHash = await bcrypt.hash(password, salt);

  //Criando o usuário a partir do User criado pelo mongoose em models user, para isso vamos usar new.
  const user = new User({
    name: name,
    email: email,
    password: passwordHash,
  });

  try {
    /* Acredito que se usarmos um banco de dados local diferente do mongoDB, teriamos que fazer o db.query(...) aqui
    inserindo os dados que quero salvar no DB.
    */
    await user.save();
    //Esta res de sucesso é a que esperamos no from depois de inserir os dados no DB.
    res
      .status(201)
      .json({ erro: false, msg: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    //Não/ nunca retornar o erro para o usuário, só estou retornando em ambiente de estudo.
    // mais correto criar um log de erros para reparos posteriores
    //clg(error);
    return res.status(500).json({ erro: true, msg: error });
  }

  //Resposta quando enviar um dado corretamente - evita o loop infinito no inmsonia.
  // return res.status(200).json({
  //   erro: false,
  //   msg: 'Dados recebidos com sucesso! ',
  // });
});

/* POST no end point /auth/Login ************************************************************************************ */
/* Login User | authenticate user | autenticação do usuário */
//OBS: sempre que trabalho com DB os professores indicam o uso do async/await
app.post('/auth/login', async (req, res) => {
  //Desestruturação / destructuring
  const { email, password } = req.body;
  //Validações como as feita acima na inserção:
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

  //Checando se o usuário existe, usamos o email para ver se já esta cadastrado.
  const user = await User.findOne({ email: email });
  if (!user)
    return res.status(404).json({
      erro: true,
      msg: `Usuário não encontrado.`,
    });

  //Check if password match | checa se o password é o mesmo feito no cadastro.
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(404).json({ erro: true, msg: 'Senha inválida.' });
  }

  /* Entraremos agora na parte do secret jwt */
  try {
    const secret = process.env.SECRET;

    //Inicio token
    //JWT é constituido de HEADER, PAYLOAD, SIGNATURE
    // estamos usando no exemplo o payload + signature
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    //fim token

    res.status(200).json({
      erro: false,
      msg: 'Autenticação realizada com sucesso.',
      token: token,
    });
  } catch (error) {
    //Não/ nunca retornar o erro para o usuário, só estou retornando em ambiente de estudo.
    // mais correto criar um log de erros para reparos posteriores
    //clg(error);
    return res.status(500).json({ erro: true, msg: error });
  }

  //Resposta quando enviar um dado corretamente - evita o loop infinito no inmsonia.
  //Comentar sempre que finalizar o http-request.
  // return res.status(200).json({
  //   erro: false,
  //   myDefault:
  //     'Msg default de confirmação, dados corretos no end point: /auth/user ',
  // });
});

/* Function Midlleware usado para autenticar o usuário para as rotas privadas. ************************************** */

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ erro: true, msg: 'Acesso negado!' });
  }
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({
      erro: error,
      msg: 'Token inválido!',
    });
  }
}

/* Mongoose connection ********************************************************************************************** */
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

/* FIM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
