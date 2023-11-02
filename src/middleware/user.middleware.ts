
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

export class UserMiddleware{

    getPublicProfile(user){
        let newUser = ({...user}._doc)
        delete newUser["password"]
        delete newUser["tokens"]
        delete newUser["createdAt"]
        delete newUser["updatedAt"]
        delete newUser["__v"]
        return user
    }

    async findByCredentials( password : string, studentPassword){
        const isMatch = await bcrypt.compare(password, studentPassword);
        if (!isMatch) {
            throw new UnauthorizedException("Password is incorrect")
        } else {
            return true;
        }
    }

    async generateAuthToken(user){
        const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET_CODE, {expiresIn : '1h'})
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
    }
}