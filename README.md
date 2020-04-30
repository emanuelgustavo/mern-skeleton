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


