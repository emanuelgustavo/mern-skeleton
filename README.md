# mern-skeleton
My mern-skeleton coded

Abaixo, o passo a passo para configurar um ambiente e um mockup de uma aplicação com a stack MERN.

## Implementando o Back-End

Para implementar o back-end, vamos começar definindo a estrutura de arquivos e pastas do projeto, instalando e configurando os módulos necessários e preparando os scripts de desenvolvimento para rodar o código.

Vamos definir o user model, as API endpoints e o a autenticação baseada em JWT.

## Estrutura de pastas e arquivos:

### Extraído do livro Full-Stack React Projects:

```
| mern_skeleton/
   | -- config/
      | --- config.js
   | -- server/
      | --- controllers/
         | ---- auth.controller.js
         | ---- user.controller.js
      | --- helpers/
         | ---- dbErrorHandler.js
      | --- models/
         | ---- user.model.js
      | --- routes/
         | ---- auth.routes.js
         | ---- user.routes.js
      | --- express.js
      | --- server.js      
  | -- .babelrc
  | -- .gitignore
  | -- nodemon.json
  | -- package.json
  | -- template.js
  | -- webpack.config.server.js
```

# Vamos lá?!

## Inicie um projeto com npm

Dentro da pasta onde vamos criar o projeto, inicie o gerenciados de pacotes npm, que criará o package.json do nosso projeto:

`$npm init`

## Instalando dependencias de desenvolvimento: Babel, Webpack and Nodemon

### Babel:

Como vamos utilizar features do ES6 em diante, precisamos instalar o Babel para converter esses códigos.

Dica: ao executar a linha de comando com o parâmetro "-D", o yarn adiciona a biblioca em devDependecies, ou seja, dependências necessárias apenas no desenvolvimento da aplicação.

`$yarn add @babel/cli -D`

`$yarn add @babel/core -D`

`$yarn add @babel/preset-env -D`

`$yarn add babel-loader -D`

`$yarn add @babel/preset-react`

Agora, vamos criar um arquivo na raiz do projeto com o nome de `.babelrc`. Aqui serão armazenados as configurações do babel. Dentro desse arquivo adicionamos as seguintes configurações:

```json
{
  "presets" : [
    "@babel/env",
    "@babel/react"
  ],
  "plugins": [
    "react-hot-loader/babel"
  ]
}
```

### webpack:

Vamos precisar do Webpack para compilar e empacotar o código do servidor usando Babel. Para isso, vamos adicionar as seguintes bibliotecas:

`$yarn add webpack -D` 

`$yarn add webpack-cli -D`

`$yarn add webpack-node-externals -D`

`$yarn add webpack-dev-middleware -D`

`$yarn add webpack-hot-middleware -D`

Para configurar o webpack, vamos criar 3 arquivos na raiz do projeto:

`webpack.config.server.js`

o conteúdo básico de cada arquivo será, com alterações para cada situação de aplicação do webpack:

```javascript

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  //configurações do webpack
  name: "server",
    entry: [ path.join(CURRENT_WORKING_DIR , './server/server.js') ],
    target: "node",
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist/'),
        filename: "server.generated.js",
        publicPath: '/dist/',
        libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    }
};

module.exports = config;

```

### Nodemon

Com o [nodemon](https://nodemon.io/), é um monitor que observa todas as alterações em nosso código e automaticamente restart o server, tornando o desenvolvimento mais fluido.

`$yarn add nodemon -D`

As configurações do nodemon ficarão em um arquivo na raiz do projeto chamado `nodemon.json`:

```json
{
  "verbose": false, 
  "watch": [
    "./server"
  ],
  "exec": "webpack --mode=development --config webpack.config.server.js && node ./dist/server.generated.js"
}
```

### Variáveis de Configuração

Dentro do arquivo `config/config.js` serão definidas algumas configurações de variáveis que serão utilizadas no código do lado do servidor:

```javascript
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost' ) + ':' + 
    (process.env.MONGO_PORT || '27017') + '/mernproject'
}

export default config
```

`env` se é para diferenciar entre modo de desenvolvimento ou produção
`port` define qual porta o servidor irá "ouvir"
`jwtSecret` é a chave secreta para assinar o JWT
`mongoUri` é o local do banco de dados Mongo para esse projeto

### Scripts para rodar

Para o desenvolvimento, vamos adicionar ao `package.json` do nosso projeto os seguintes scripts:

```json
"scripts": {
    "development": "nodemon",
    "build": "webpack --config webpack.config.client.production.js && webpack --mode=production --config webpack.config.server.js",
    "start": "NODE_ENV=production node ./dist/server.generated.js"
  }
```

## Preparando o Servidor

Vamos configurar um servidor completo integrando Express, Node e MongoDB.

### Express

Vamos primeiro instalar o express:

`$yarn add express`

As configurações do express serão colocadas no arquivo `/server/express.js`:

```javascript 
import express from 'express'
const app = express()
  /*... configure express ... */
export default app
```

Para lidar com requisições HTTP e servir as respostas, vamos utilizar os seguintes módulos para configurar Express:

`$yarn add body-parser`

`$yarn add cookie-parser`

`$yarn add compression`

`$yarn add helmet`

`$yarn add cors` 

No arquivo `/server/express.js` adicione as seguintes linhas de código para configurar os middlewares instalados: 

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

export default app

```

### Iniciando o servidor

Com o Express app preparado para aceitar requisições HTTP vamos fazer o servidor ouvir essas requisições.

Vamos criar um arquivo `/server/server.js` e adicionar as seguintes linhas de código:

```javascript
import config from './../config/config.js';
import app from './express.js';

app.listen(config.port, (error) => {
  if (error) console.log(error);
  console.info(`Server started on port: ${config.port}`);
});
```

Estamos importando as variáveis configuradas em `/config/config.js` e passando ao método `listen` a porta onde ele ouvirá as requisições.

Antes de continuar, vamos verificar se o código está rodando executando no terminal dentro da pasta do projeto `$npm run development`. Se rodar sem aparecer erros, estamos no caminho certo.


### COnfigurando e conectando o banco de dados MongoDB

Certifique-se de ter o MongoDB instalado em sua máquina. Se não, [clica aqui!](https://docs.mongodb.com/manual/installation/)

Vamos utilizar o [Mongoose](https://mongoosejs.com/) para implementar o user Model e também todas as features de modelagem de dados para nossa aplicação. 

Vamos iniciar instalando e configurando o `Mongoose`:

`$yarn add mongoose`

Agora, vamos configurar o `Mongoose` dentro do arquivo `server/server.js`:

```javascript
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})
```

Reinicie o servidor para integrar o Mongoose ao MongoDB.

### Servindo um template HTML como uma URL root

Agora que configuramos o Node, Express e MongoDB como um servidor rodando, vamos configurar uma página para responder a requisição a URL root "/".

Dentro da pasta raiz do projeto vamos criar um arquivo com o nome de `template.js` e colocar o seguinte código:

```javascript
export default () => {
    return `<!doctype html>
      <html lang="en">
          <head>
             <meta charset="utf-8">
             <title>MERN Skeleton</title>
          </head>
          <body>
            <div id="root">Hello World</div>
          </body>
      </html>`
}
```

Vamos mostrar ao servidor o que fazer quando ele receber uma requisição GET para a url root. No arquivo `server/express.js` vamos colocar o seguinte código:

```javascript
import Template from './../template'
...
app.get('/', (req, res) => {
  res.status(200).send(Template())
})
...
```

Agora, quando acessamos a URL root, vemos renderizado na página a mensagem "Hello World".

### User model

Vamos implementar o modelos de usuário usando o Mongoose para definir o schema com os campos de dados necessários, adicionar validação para o campos, definir a lógica das regras de negócio bem como incorporar uma senha encriptada para validação e autenticação.

Vamos criar um arquivo `/server/models/user.model.js` e através do mongoose gerar o UserSchema:

```javascript
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({ … })
```

### Definindo o UserSchema

Vamos adicinar os campos e suas propriedades ao UserSchema:

```javascript
...

const UserSchema = new mongoose.Schema({ 
  name: {
   type: String,
   trim: true,
   required: 'Name is required'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  hashed_password: {
      type: String,
      required: "Password is required"
  },
  salt: String,
  UserSchema
    .virtual('password')
    .set(function(password) {
      this._password = password
      this.salt = this.makeSalt()
      this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
      return this._password
    })
  })
```

Vamos adiciona também alguns métodos:

```javascript
UserSchema.methods = {

  authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password
    },

  encryptPassword: function(password) {
      if (!password) return ''
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex')
      } catch (err) {
        return ''
      }
    },

  makeSalt: function() {
      return Math.round((new Date().valueOf() * Math.random())) + ''
    }
    
}

UserSchema.path('hashed_password').validate(function(v) {

  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }

}, null)

export default mongoose.model('User', UserSchema) 

```

### Lidando com erros Mongoose

Vamos criar o arquivo `/server/helpers/dbErrorHandler.js` e adicionar o seguinte código:

```javascript
const getErrorMessage = (err) => {
  let message = ''
  if (err.code) {
      switch (err.code) {
          case 11000:
          case 11001:
              message = getUniqueErrorMessage(err)
              break
          default:
              message = 'Something went wrong'
      }
  } else {
      for (let errName in err.errors) {
          if (err.errors[errName].message)
          message = err.errors[errName].message
      }
  }
  return message
}

const getUniqueErrorMessage = (err) => {
  let output
  try {
      let fieldName =   
      err.message.substring(err.message.lastIndexOf('.$') + 2,                                             
      err.message.lastIndexOf('_1'))
      output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) +   
      ' already exists'
  } catch (ex) {
      output = 'Unique field already exists'
  }
  return output
}

export default {getErrorMessage}
```

## User CRUD API

Os endpoints expostos pelo Expresse permitirão ao frontend usar as operações CRUD nos documento gerados no banco de dados de acordo com o user model.

Para implementar os endpoints, vamos implementar rotas Express correspondentes e ligá-las ao controller correspondente onde funcões callbak serão executadas quando as requisições HTTP chegarem a essas rotas.

Vamos criar o arquivo `/server/routes/user.routes.js` e definir as rotas.

### User routes

Teremos duas rotas em nosso app:

`/api/users` e o `/api/users/:userId`. 

No primeiro iremos listar os usuários com o método GET e criar um novo usuário com o método POST. 

No segundo, vamos fazer um fetching de um usuário com o método GET, atualizar com o método PUT e deletar com o método DELETE.

Dentro do arquivo `server/express.js` vamos adicionar as seguintes linhas:

```javascript
import userRoutes from './routes/user.routes'
...
app.use('/', userRoutes)
...
```

Vamos então criar o arquivo `server/routes/user.routes.js` e configirar as rotas como segue:

```javascript
import express from 'express'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/:userId')
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove)

router.param('userId', userCtrl.userByID)

export default router
```

### User Controller

Vamos criar o arquivo `server/controllers/user.controller.js` que conterá os métodos do user controller que serão acessados a partir do user routes quando uma rota for requisitada pelo front-end.

Vamos adicionar o seguinte código:

```javascript
import User from '../models/user.model'
import _ from 'lodash'
import errorHandler from './error.controller'

const create = (req, res, next) => { … }
const list = (req, res) => { … }
const userByID = (req, res, next, id) => { … }
const read = (req, res) => { … }
const update = (req, res, next) => { … }
const remove = (req, res, next) => { … }

export default { create, userByID, read, list, remove, update }
```

O controller usará um `errorHandler` para ajudar a responder a rota erros ocorridos no Mongoose com mais significado. Para isso, vamos instalar o módulo chamado `loadsh` que é um biblioteca JavaScript.

`$yarn add loadsh`

Vamos agora configurar cada endpoint da API.

### Criando um novo usuário

O código abaixo que adicionamos dentro do arquivo `/server/routes/user.routes.js` indica a endpoint de criação de usuário:

```javascript
router.route('/api/users')
  .post(userCtrl.create)
```

Quando o `app Express` recebe uma requisição com método POST em `'api/users'`, ele chama a função `create` definida no controller:

Vamos atualizar o método create no arquivo `server/controllers/user.controller.js`:

```javascript
const create = (req, res, next) => {
  const user = new User(req.body)
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(200).json({
      message: "Successfully signed up!"
    })
  })
}
```

Essa função cria um novo usuário com o usuário sendo passado atráves do body da requisição POST no formato JSON.

### Listando todos os usuários

O código abaixo que adicionamos dentro do arquivo `/server/routes/user.routes.js` indica a endpoint que lista todos os usuários:

```javascript
router.route('/api/users')
  .get(userCtrl.list)
```

Vamos atualizar o método list no arquivo `server/controllers/user.controller.js`:

```javascript
const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).select('name email updated created')
}
```

Esse método busca todos os usuário e retorna os dados em formato JSON.

###  Loading a user by ID to read, update, or delete

Essas três endpoints da API requerem um id de usuário que será carregado antes do Express router responder a request respectiva para o read, update e delete.

### Loading

Sempre que o Express receber uma request que contém em seu path o parâmtro `:userId`, o app irá executar primeiro a função `userByID` dentro do controller antes de ir a próxima função com o `next`. 
Para mais informações sobre o `Express router.param` [clique aqui](http://expressjs.com/en/5x/api.html#router.param).

O código abaixo que adicionamos dentro do arquivo `/server/routes/user.routes.js` chama a função `userByID`:

```javascript
router.param('userId', userCtrl.userByID)
```

Vamos atualizar o método userByID no arquivo `server/controllers/user.controller.js`:

```javascript
const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  })
}
```

Se o usuário for encontrado no bando de dados um objeto é adicionado ao objeto da requisição dentro do `profile`. Então, atráves do `middleware` `netx()` o controle é propagado para a próxima função relevante no controller de acordo com o método HTTP solicitado na request.

### Reading

A endpoint da API que faz a leitura de um único usuário dentro do arquivo `/server/routes/user.routes.js` é:

```javascript
router.route('/api/users/:userId')
  .get(userCtrl.read)
```
Vamos atualizar o método read no arquivo `server/controllers/user.controller.js`:

```javascript
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}
```

Essa função remove as informações sensíveis do profile do usuário como a senha antes de retornar as informação no objeto response para o client.

### Updating

A endpoint da API que faz a atualização de um único usuário dentro do arquivo `/server/routes/user.routes.js` é:

```javascript
router.route('/api/users/:userId')
  .put(userCtrl.update)
```
Vamos atualizar o método update no arquivo `server/controllers/user.controller.js`:

```javascript
const update = (req, res, next) => {
  let user = req.profile
  user = _.extend(user, req.body)
  user.updated = Date.now()
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  })
}
```

Essa função recebe os detalhes do usuário do `req.profile` então utiliza o `loadsh` para extender e fazer um merge dos dados alterados que vem atráves do body da requisição. Antes de salvar o usuário atualizado no banco de dados, o campo `updated` é atualizado com o data do momento da atualização. Novamente as informações sensíveis como a senha são removidos do objeto antes de enviar o objeto de response para o client.

### Deleting

A endpoint da API que exclui um único usuário dentro do arquivo `/server/routes/user.routes.js` é:

```javascript
router.route('/api/users/:userId')
  .delete(userCtrl.remove)
```
Vamos atualizar o método remove no arquivo `server/controllers/user.controller.js`:

```javascript
const remove = (req, res, next) => {
  let user = req.profile
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
}
```

Essa função recebe os detalhes do usuário do `req.profile` então utiliza o `remove()` para excluir do banco de dados o usuário. Novamente as informações sensíveis como a senha são removidos do objeto antes de enviar o objeto de response para o client.


Agora é possível utilizar as operações de CRUD na aplicação.

## User auth and protected routes

Para restringir o acesso a operações de atualização e de remoção de um usuário, vamos implementar um sign-in autenticado com JWT, para as rotas de read, update e delete.

O endpoint relacionado ao sign-in e sign-ou do app será implementado no arquivo que criamos em `server/routes/auth.routes.js` e depois configurado no `/server/express.js` da seguinte maneira:

```javascript
import authRoutes from './routes/auth.routes'
  ...
  app.use('/', authRoutes)
  ...
```

### Auth routes

Duas APIs de autenticação serão declaradas path de rotas com métodos HTTP atráves do `express.Routes()` chamando suas respectivas funções no `auth controller`:

 - `'/auth/sigin'`: requisição autenticada com método POST que requer do usuário email e senha

 - `'/auth/signout'`: requisição GET para limpar o cookie que contém o JWT que foi armazenado como objeto da resposta do sign-in

 Vamos adicionar essas rotas ao `server/routes/auth.routes.js`:

 ```javascript
import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/auth/signin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .get(authCtrl.signout)

export default router
```

### Auth controller

O `auth controller` terá funções que além de lidar com as requisições de sign-in e sign-ou também irão fornecer o JWT e funcionalidade `express-jwt` que irão habilitar a autenticação e autorização do usuário a endpoint protegidas da API.

Vamos instalar o `jsonwebtoken`:

`$yarn add jsonwebtoken`

Vamos criar o arquivo `/server/controllers/auth.controller.js` e digitar o seguinte código:

 ```javascript
import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = (req, res) => { … }
const signout = (req, res) => { … }
const requireSignin = … 
const hasAuthorization = (req, res) => { … }

export default { signin, signout, requireSignin, hasAuthorization }
```

Essa quatro funções mostram como o backend implementa uma autenticação de usuário usando JSON Web Tokens (JWT). Vamos implementá-las a seguir:

### Sign-in

A endpoint da API que faz o sign-in do usuário dentro do arquivo `/server/routes/auth.routes.js` é:

```javascript
router.route('/auth/signin')
  .post(authCtrl.signin)
```
Vamos atualizar o método sigin no arquivo `server/controllers/auth.controller.js`:

```javascript
const signin = (req, res) => {
  User.findOne({
    "email": req.body.email
  }, (err, user) => {
    if (err || !user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }

    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.json({
      token,
      user: {_id: user._id, name: user.name, email: user.email}
    })
  })
}
```

A requisição POST recebe um email e uma password no `req.body`, que são usados para verificar se o usuário existe no bando de dados. Então, se o usuário exite, o módulo JWT é usado para gerar um JWT usando uma chave secreta e o `_id` do usuário. Então, o JWT é retornado junto com os detalhes do usuário para o client agora autenticado. Opcionalmente, podemos também definir o token para um cookie no objeto resposta então ele estará disponivel para o client side se os cookies foram escolhidos como forma de armazenar o JWT. No client side, sempre que for feita uma requisição ao server-side para rotas protegidas, o token deve ser anexado com uma `Authorization` no header.

### Sign-out

A endpoint da API que faz o sign-out do usuário dentro do arquivo `/server/routes/auth.routes.js` é:

```javascript
router.route('/auth/signout')
  .get(authCtrl.signout)
```
Vamos atualizar o método signout no arquivo `server/controllers/auth.controller.js`:

```javascript
const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}
```

Essa função limpa o cookie que contém o JWT. O client precisa excluir o token no client-side para que o usuário não esteja mais autenticado.

## Protecting routes with express-jwt

Para acessar as funções de read, uptade e delete, o servidor precisa se certificar que o usuário que está fazendo a requisição está autenticado e autorizado. Para isso vamos usar o módulo `express-jwt`.

Vamos instalar o `express-jwt`:

`$yarn add express-jwt`

### Requiring sign-in

Dentro do `auth.controller.js`, o método `requireSignin` usa o `express-jwt` para verificar se a requisição tem um JWT válido no `Authorization` do header. Se sim, ele adiciona uma chave 'auth' ao objeto da requisição do usuário, senão dispara um erro.

No arquivo `/server/controllers/auth.controller.js` vamos digitar o seguinte código:

```javascript
const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})
```

Podemos adicionar o método `requireSignin` a qualquer rota que queremos proteger contra acessos sem autenticação.

### Authorizing signed in users

Para algumas rotas protegidas como update e delete, além de verificar se o usuário está autenticado, vamos verificar se ele está autorizado a realizar esses procedimentos, no caso deste app, o único usuário que poderá atualizar ou excluir seu perfil é o dono do perfil. Para fazer isso, a função `hasAuthorization` checa se o usuário autenticado é o mesmo.

No arquivo `/server/controllers/auth.controller.js` vamos digitar o seguinte código:

```javascript
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == 
  req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}
```

### Protecting user routes

Nós iremos adicionar `requireSignin` e `hasAuthorization` as rotas onde é necessário que o usuário seja autenticado e autorizado. Vamos incluir dentro das rotas no arquivo `server/routes/user.routes.js` como segue:

```javascript
import authCtrl from '../controllers/auth.controller'
...
router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, 
     userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, 
     userCtrl.remove)
...
```

## Auth error handling for express-jwt

Para lidar com error gerados pelo `express-jwt` quando ele tenta validar um token JWT nós precisamos adicionar o seguinte capturador de error no app Express no arquivo: `/server/express.js`:

```javascript
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }
})
```

Esse código precisa ser implementado no fim do código e antes do app ser exportado.

O `express-jwt` lança um erro chamado `UnauthorizedError` quando o token não pode ser validado por qualquer razão. Nós capturamos esse erro e retornamos ao client o seu status.

Com isso, finalizamos todas as features necessárias para que o backend do MERN funcione.

