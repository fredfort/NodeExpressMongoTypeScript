import { NextFunction, Request, Response } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';

class TokenValidation {

  private static sendError(res: Response, message: string): void {
    res.status(401).send({
      error: message,
      status: 401,
    });
  }

  public validateToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET;
    if (!token || !jwtSecret) {
      TokenValidation.sendError(res, `Authentication error. Token required.`);
    } else {
      try {
        (req as any).decodedToken = jwtVerify(token, jwtSecret);
        next();
      } catch (err) {
        TokenValidation.sendError(res, `Invalid token`);
      }
    }
  }
}

export default new TokenValidation().validateToken;
