import mongoose from "mongoose";
import * as jwt from 'jsonwebtoken'
import { Admin } from "../../src/admin/schemas/admin.schema";
import { Staff } from "../../src/staff/schemas/staff.schema";
import { ObjectId } from "bson";

export const staffStub = ()  => {
    return  {
        _id : new ObjectId("6556eb0e3e72dd881bac84fb"),
        name : 'John',
        email: 'john@example.com',
        password : 'John@1234',
        phoneNumber : '1234567890',
        department : 'CE',
        attendance : 120,
        tokens : [{
            token : jwt.sign({_id : new ObjectId("6556eb0e3e72dd881bac84fb")}, process.env.JWT_SECRET_CODE)
        }]
    }
}