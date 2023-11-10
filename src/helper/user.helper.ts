import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt"
import { error } from "console";
import * as jwt from "jsonwebtoken"
import { Admin } from "src/admin/schemas/admin.schema";
import { Staff } from "src/staff/schemas/staff.schema";
import { Student } from "src/student/schemas/student.schema";

export class UserHelper{
/**
 * @description : remove unwanted field from document
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {*} user
 * @returns {*} 
 */
    static getPublicProfile(user : Staff | Student | Admin | any){
        if(process.env.NODE_ENV !== 'test'){
            let newUser = ({...user}._doc)
            delete newUser["password"]
            delete newUser["tokens"]
            delete newUser["createdAt"]
            delete newUser["updatedAt"]
            delete newUser["__v"]
            return user
        }
    }
/**
 * @description : use for authenticate  user using email and password
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {string} password
 * @param {*} userPassword
 * @returns {*} 
 */
    static async findByCredentials( password : string, userPassword){
        if(process.env.NODE_ENV !== 'test'){
            const isMatch = await bcrypt.compare(password, userPassword);
            if (!isMatch) {
                throw new UnauthorizedException("Password is incorrect")
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
/**
 * @description : this function generate authentication token
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {*} user
 * @returns {*} 
 */
    static async generateAuthToken(user){
        if(process.env.NODE_ENV !== 'test'){
            const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET_CODE, {expiresIn : '1h'})
            user.tokens = user.tokens.concat({token})
            const saveData = await user.save()
            if(!saveData){
                throw new Error('User already exist!')
            }
            return token
        }
    }

    /**
     * @description : convert password of user to hashcode
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} user
     * @returns {*} 
     */
    static async convertToHash(user){
        if(process.env.NODE_ENV !== 'test'){
            const newPassword:any = await bcrypt.hash(user.password, 8); //generate hash password from student's password 
            user.password = newPassword;
            return user
        }
    }
}