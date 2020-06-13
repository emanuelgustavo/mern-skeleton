import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import Template from './../template.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
/*... configure express ... */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

/**use auth routes for restrict endpoint */
app.use('/', authRoutes);

app.get('/', (request, response) => { 
  response
    .status(200)
    .send(Template());
});
 
/**Auth error handling for express-jwt */
app.use((error, req, res, next) => { 
  if (error.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({
        'error': error.name + ': ' + error.message
      });
  }
});

export default app;
