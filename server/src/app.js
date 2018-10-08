import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { config } from 'dotenv';

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

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpack = require('webpack');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const configWp = require('../../webpack.dev.js').default;
  const webpackDevMiddleware = require('webpack-dev-middleware');
  /* eslint-enable global-require, import/no-extraneous-dependencies */

  const compiler = webpack(configWp);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: configWp.output.publicPath,
    stats: { colors: true },
    noInfo: true
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use('/api/v1/meals', routers.mealRouter);
app.use('/api/v1/menu', routers.menuRouter);
app.use('/api/v1/orders', routers.orderRouter);
app.use('/api/v1/auth', routers.authRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static(path.resolve(__dirname, '../../client/', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use(validationErrors);
// Get port from environment and store in Express.
const PORT = parseInt(process.env.PORT, 10) || 3500;
app.set('port', PORT);

app.listen(PORT, () => {
  /* eslint no-console: off */
  console.log(`API is running on port ${PORT}`);
});
export default app;
