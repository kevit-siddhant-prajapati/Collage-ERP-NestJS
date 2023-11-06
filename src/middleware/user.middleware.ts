
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt"
import { error } from "console";
import * as jwt from "jsonwebtoken"
import { Admin } from "src/admin/schemas/admin.schema";
import { Staff } from "src/staff/schemas/staff.schema";
import { Student } from "src/student/schemas/student.schema";

export class UserMiddleware{

    getPublicProfile(user : any){
        let newUser = ({...user}._doc)
        delete newUser["password"]
        delete newUser["tokens"]
        delete newUser["createdAt"]
        delete newUser["updatedAt"]
        delete newUser["__v"]
        return user
    }

    async findByCredentials( password : string, userPassword){
        const isMatch = await bcrypt.compare(password, userPassword);
        if (!isMatch) {
            throw new UnauthorizedException("Password is incorrect")
        } else {
            return true;
        }
    }

    async generateAuthToken(user){
        const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET_CODE, {expiresIn : '1h'})
        user.tokens = user.tokens.concat({token})
        const saveData = await user.save()
        if(!saveData){
            throw new Error('User already exist!')
        }
        return token
    }

    async convertToHash(user){
        const newPassword:any = await bcrypt.hash(user.password, 8); //generate hash password from student's password 
        user.password = newPassword;
        console.log('User is given below')
        console.log(user)
        return user
    }
}