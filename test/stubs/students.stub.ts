import mongoose from "mongoose";
import { Student } from "../../src/student/schemas/student.schema";
import * as jwt from 'jsonwebtoken'
import { ObjectId } from "bson";

export const studentStub = ()  => {
    const studentOne = {
        _id : new ObjectId("654c90d94d320ee33c106517"),
        name : 'Mike',
        email: 'mike@example.com',
        password : 'Mike@1234',
        phoneNumber : '1234567890',
        department : 'CE',
        batch : 2020,
        currentSem : 1,
        attendance : 120,
        tokens : [{
            token : jwt.sign({_id : new mongoose.Types.ObjectId()}, process.env.JWT_SECRET_CODE)
        }]
        }
        //console.log(`Generated token: ${studentOne.tokens[0].token}`);
    return studentOne
}