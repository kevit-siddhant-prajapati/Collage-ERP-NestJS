import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Staff } from './schemas/staff.schema';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken'
/**
 * @description : this guard is usefull for authorize staff (not implement in code)
 * @author Siddhant Prajapati
 * @export
 * @class StaffAuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class StaffAuthGuard implements CanActivate {
    constructor(
        @InjectModel(Staff.name) private readonly StaffModel : Model<Staff>,
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

            const staff = await this.StaffModel.findOne({ _id: decoded._id, 'tokens.token': tokenArr[1] });

            if (!staff) {
                throw new UnauthorizedException('User not found');
            }

            req.token = tokenArr[1];
            req.staff = staff;

            return true;
        } catch (e) {
            throw new UnauthorizedException(`Authentication fail! ${e.message}`);
        }
    }
}

