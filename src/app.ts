import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
const xss = require('xss-clean');

const app = express();

app.use(helmet());

app.use(xss());

app.use(compression());

app.use(cors());

export default app;