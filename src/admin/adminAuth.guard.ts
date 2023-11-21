import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken'
/**
 * @description : this guard is usefull for authorize admin (not implement in code)
 * @author Siddhant Prajapati
 * @export
 * @class AdminAuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        @InjectModel(Admin.name) private readonly AdminModel : Model<Admin>,
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const token = req.header('Authorization');
            if (!token) {
                throw new UnauthorizedException('No token provided');
            }

            const tokenArr = token.split(' ');
            if (tokenArr.length !== 2 || tokenArr[0] !== 'Bearer') {
                throw new UnauthorizedException('Invalid token format');
            }

            const decoded: any = jwt.verify(tokenArr[1], process.env.JWT_SECRET_CODE);

            if (!decoded) {
                throw new UnauthorizedException('Token verification failed');
            }

            const admin = await this.AdminModel.findOne({ _id: decoded._id, 'tokens.token': tokenArr[1] });

            if (!admin) {
                throw new UnauthorizedException('User not found');
            }

            req.token = tokenArr[1];
            req.staff = admin;

            return true;
        } catch (e) {
            throw new UnauthorizedException(`Authentication fail! ${e.message}`);
        }
    }
}

