import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import helmet from 'helmet';
import { Application } from 'express';
import UserRoutes from './user/user.route';
import { load } from 'dotenv';
load();

class App {
  public app: express.Application;
  public mongoUrl: string = this.getMongoUrl();

  constructor() {
    this.app = express();
    this.config(this.app);
    UserRoutes.routes(this.app);
  }

  private config(app: Application): void {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(helmet()); // Security https://expressjs.com/en/advanced/best-practice-security.html
    connect(
      this.mongoUrl,
      { useNewUrlParser: true, useCreateIndex: true },
    );
  }

  private getMongoUrl() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_URL, MONGO_PORT } = process.env;
    // return `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}:${MONGO_PORT}/CRMdb`;
    return `mongodb://${MONGO_URL}:${MONGO_PORT}/CRMdb`;
  }
}

export default new App().app;
