import mongoose from "mongoose";
import * as jwt from 'jsonwebtoken'
import { Admin } from "../../src/admin/schemas/admin.schema";
import { Staff } from "../../src/staff/schemas/staff.schema";

export const staffStub = ()  => {
    return  {
        _id : new mongoose.Types.ObjectId(),
        name : 'John',
        email: 'john@example.com',
        password : 'John@1234',
        phoneNumber : '1234567890',
        department : 'CE',
        attendance : 120,
        tokens : [{
            token : jwt.sign({_id : new mongoose.Types.ObjectId()}, process.env.JWT_SECRET_CODE)
        }]
    }
}