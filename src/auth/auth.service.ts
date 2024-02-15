// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { NextFunction, Request, Response } from 'express';
// import { UserEntity } from "src/user/user.entity";

// export interface ExpressRequest extends Request {
//     user?: UserEntity;
// }
// @Injectable()
// export class AuthService implements NestMiddleware {
//     constructor(
//         private jwtService: JwtService
//     ) {}
//     use(req: ExpressRequest, res: Response, next: NextFunction) {
//         if (!req.headers['authorization']) {
//             req.user = null
//             next()
//             return
//         }
//         const token = req.headers['authorization'].split(' ')[1]
//         try {
//             // const decode = this.jwtService.verify(token, 'JWT_SECRET'): { email: string }
//         } catch (error) {
//             req.user = null
//             next()
//         }
//     }
// }
