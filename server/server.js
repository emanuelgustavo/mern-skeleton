import mongoose, { mongo } from 'mongoose';
import config from './../config/config.js';
import app from './express.js';

//start server
app.listen(config.port, (error) => {
  if (error) console.log(error);
  console.info(`Server started on port: ${config.port}`);
});

//mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => { 
  throw new Error(`unable to connect to database: ${mongoUri}`);
});