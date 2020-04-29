import config from './../config/config.js';
import app from './express.js';

app.listen(config.port, (error) => {
  if (error) console.log(error);
  console.info(`Server started on port: ${config.port}`);
});