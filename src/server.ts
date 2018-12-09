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
  .listen(3005);
