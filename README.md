#1 fase do projeto
- mkdir [nome da pasta] // criar pasta
- cd [nome da pasta] // mudar para a pasta
- code . // abrir o vsCode dentro da pasta acima criada
- ls //mostrar arquivos dentro da pasta
- ls -la // mostrar todos os arquivos inclusive os ocultos
- touch README.md // touch é para criar arquivos
- npm init -y //pula as perguntas

##2 fase // instalar as dependencias utilizadas no projeto:
- npm i bcryptjs --save //Vai criar a hash de senha e tbm decodificar.
- npm i dotenv --save-dev //Usado para salvar dados sensíveis no projeto.
- npm i express --save // Framework usado para criar api's.
- npm i jsonwebtoken --save // Usado para manusear o Token.
- npm i mongoose --save //Pacote de banco de dados utilizado para facilitar o trabalho como mongoDB.
- npm i nodemon --save-dev //Usado para facilitar a criação das api's, restarta automaticamente após cada alteração.