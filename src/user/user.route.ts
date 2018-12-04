import { Application } from 'express';
import { UserController } from './user.controller';
import tokenValidation from '../utils/tokenValidation';

class UserRoutes {
  public userController: UserController = new UserController();

  public routes(app: Application): void {

    app
    .route('/')
    .post(this.userController.test);
    // User Login
    app
    .route('/login')
    .post(this.userController.loginUser);

    // User
    app
      .route('/user')
      .get(tokenValidation, this.userController.getUsers)
      .post(this.userController.addNewUser);

    // User detail
    app
      .route('/user/:userId')
      .get(tokenValidation, this.userController.getUserById)
      .put(tokenValidation, this.userController.updateUser)
      .delete(tokenValidation, this.userController.deleteUser);
  }
}

export default new UserRoutes();
