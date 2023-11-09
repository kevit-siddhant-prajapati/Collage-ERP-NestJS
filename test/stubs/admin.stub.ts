import mongoose from "mongoose";
import * as jwt from 'jsonwebtoken'
import { Admin } from "../../src/admin/schemas/admin.schema";

export const adminStub = ()  => {
    return  {
        _id : new mongoose.Types.ObjectId(),
        name : 'Sara',
        email: 'sara@admin.com',
        password : 'Sara@1234',
        tokens : [{
            token : jwt.sign({_id : new mongoose.Types.ObjectId()}, process.env.JWT_SECRET_CODE)
        }]
    }
}