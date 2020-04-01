import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import {
  config
} from 'dotenv';

import swaggerDocument from './swagger.json';
import routers from './routes';
import validationErrors from './middleware/validationErrors';


config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/v1/meals', routers.mealRouter);
app.use('/api/v1/menu', routers.menuRouter);
// app.use('/api/v1/orders', routers.orderRouter);
app.use('/api/v1/auth', routers.authRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(validationErrors);
// Get port from environment and store in Express.
const PORT = parseInt(process.env.PORT, 10) || 5300;
app.set('port', PORT);

if(!module.parent){
  app.listen(PORT, () => {
    /* eslint no-console: off */
    console.log(`API is running on port ${PORT}`);
  });
}
export default app;
