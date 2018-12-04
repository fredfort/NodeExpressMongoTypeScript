import User, { UserType } from './user.model';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Document } from 'mongoose';

interface IErrorMessage {
  message: string;
}
type MongoResponse = Document[] | Document | null;
const saltOrRounds = 10;
export class UserController {

  private static handleResponse(res: Response, err: any, body?: MongoResponse | IErrorMessage | any): any {
    if (err) {
      res.status(400).send(err);
    } else {
       res.json(body);
    }
  }

  public test(req: Request, res: Response) {
    res.send('API works');
  }

  public addNewUser(req: Request, res: Response) {
    hash(req.body.password, saltOrRounds)
    .then( ( hashedPassword: string ) =>  {
        const newUser = new User({...req.body, password: hashedPassword });
        newUser.save((err, user: UserType) => {
          UserController.handleResponse(res, err, user);
        });
    }).catch( (err: any) => {
      UserController.handleResponse(res, {message: 'could not encrypt the password'});
    });
  }

  public getUsers(req: Request, res: Response) {
    User.find({}, (err, user: UserType[]) => {
      UserController.handleResponse(res, err, user );
    });
  }

  public loginUser(req: Request, res: Response) {
    const loggedUser = new User(req.body);
    User.findOne({ email: loggedUser.email}, (err, user: UserType | null) => {
      if (user) {
        compare(loggedUser.password, user.password)
        .then((match) => {
          if (match) {
            const token = sign({user}, process.env.JWT_SECRET || '', { expiresIn: '7d', issuer: 'fred.fort' } );
            user.password = ''; // Hack
            UserController.handleResponse(res, err, {user, token});
          } else {
            UserController.handleResponse(res, { message: 'Username/password do not match' } );
          }
        })
        .catch((errDecrypt: any) => {
          UserController.handleResponse(res, { message: 'Error descrypting the password' } );
        });
      } else {
        UserController.handleResponse(res, { message: 'Username/password do not match' } );
      }
    });
  }

  public getUserById(req: Request, res: Response) {
    User.findById(req.params.userId, (err, user: UserType) => {
      UserController.handleResponse(res, err, user);
    });
  }

  public updateUser(req: Request, res: Response) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user: UserType | null) => {
      UserController.handleResponse(res, err, user);
      },
    );
  }

  public deleteUser(req: Request, res: Response) {
    User.remove({ _id: req.params.userId }, (err) => {
      UserController.handleResponse(res, err, { message: 'Successfully deleted user!' });
    });
  }
}
