const HTTPS_PORT = 3000;

import app from './app';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

const httpsOptions = {
  cert: fs.readFileSync('./config/cert.pem'),
  key: fs.readFileSync('./config/key.pem'),
};

https
  .createServer(httpsOptions, app)
  .listen(HTTPS_PORT, () => console.log(`server runing on ${HTTPS_PORT}`));
