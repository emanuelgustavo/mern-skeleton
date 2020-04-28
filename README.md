# mern-skeleton
My mern-skeleton coded

Abaixo, o passo a passo para configurar um ambiente e um mockup de uma aplicação com a stack MERN.

## Inicie um projeto com npm

Dentro da pasta onde vamos criar o projetos, inicie o gerenciado de pacote npm, que criará o package.json do nosso projeto:

`$npm init`

## Babel, Webpack and Nodemon

### Primeiro, configurar Babel:

Vamos precisar das seguintes bibliotecas do babel.

Dica: ao executar a linha de comando com o parâmetro "-D", o yarn adiciona a biblioca em devDependecies, ou seja, dependências necessárias apenas no desenvolvimento da aplicação.

`$yarn add @babel/cli -D`

`$yarn add @babel/core -D`

`$yarn add @babel/preset-env -D`

`$yarn add babel-loader -D`

`$yarn add babel-preset-react -D`

Agora, vamos criar um arquivo na raiz do projeto com o nome de `.babelrc`. Aqui serão armazenados as configurações do babel. Dentro desse arquivo adicionamos as seguintes configurações:

```json
{
  "presets" : [
    "@babel/preset-env",
    "react"
  ],
  "plugins": [
    "react-hot-loader/babel"
  ]
}
```

### Segundo, configurar o webpack:

Vamos adicionar as seguintes bibliotecas para configurar o webpack:

`$yarn add webpack -D` 

`$yarn add webpack-cli -D`

`$yarn add webpack-node-externals -D`

`$yarn add webpack-dev-middleware -D`

`$yarn add webpack-hot-middleware -D`

Para configurar o webpack, vamos criar 3 arquivos na raiz do projeto:

`webpack.config.client.js`

`webpack.config.server.js`

`webpack.config.client.production.js`

o conteúdo básico de cada arquivo será, com alterações para cada situação de aplicação do webpack:

```javascript

const path = require('path');
const webpack = require('webpack');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  //configurações do webpack
};

module.exports = config;

```

### Terceiro, Nodemon

Com o [nodemon](https://nodemon.io/), é um monitor que observa todas as alterações em nosso código e automaticamente restart o server, tornando o desenvolvimento mais fluido.

`$yarn add nodemon -D`
