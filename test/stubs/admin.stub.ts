import mongoose from "mongoose";
import * as jwt from 'jsonwebtoken'
import { Admin } from "../../src/admin/schemas/admin.schema";
import { ObjectId } from "bson";

export const adminStub = ()  => {
    return  {
        _id : new ObjectId("6556eb0e3e72dd881bac8501"),
        name : 'Sara',
        email: 'sara@admin.com',
        password : 'Sara@1234',
        tokens : [{
            token : jwt.sign({_id : new ObjectId("6556eb0e3e72dd881bac8501")}, process.env.JWT_SECRET_CODE)
        }]
    }
}