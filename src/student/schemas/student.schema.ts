import { Schema, Prop, SchemaFactory, raw } from "@nestjs/mongoose";
import validator from "validator";
import * as bcrypt from "bcrypt";
import mongoose from "mongoose";

/**
 * @description : Student schema give property for generate new student
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class Student
 */
@Schema({
    timestamps :true
})
export class Student{
    static findByCredentials(email: any, password: any) {
        throw new Error('Method not implemented.');
    }
    @Prop({
        required : true,
        trim : true,
        validate: function (value:string) {
            if (value == null) {
                throw new Error('Name is required');
            }
        }
    })
    name:string;
    
    @Prop({
        require: true,
        unique: true,
        validate: function (value:string) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    })
    email:string;
    
    @Prop({
        default: 0,
        validate: function (value:number) {
            if (value < 0 && value >= 8) {
                throw new Error('This current Sem is not available');
            }
        }
    })
    currentSem:number;
    
    @Prop({
        require: true,
        minlength: 7,
        validate: async function (value:string) {
            value = value.trim();
            if (value.toLowerCase() == 'password') {
                throw new Error('Password must not contain string "password"');
            }
        }
    })
    password:string;
    
    @Prop({
        validate: function (value:string) {
            if (value.length != 10) {
                throw new Error('Please insert right phoneNumber');
            }
        }
    })
    phoneNumber : string;
    
    @Prop({
        require: true,
        validate: function (value:number) {
            if (value < 2000 || value > 3000) {
                throw new Error('Enter valid batch');
            }
        }
    })
    batch : number;
    
    @Prop({
        require: true,
        validate: function (value:string) {
            const Branch = ['CE', 'ME', 'EC'];
            if (!Branch.includes(value)) {
                throw new Error('Branch must in CE, ME and EC');
            }
        }
    })
    department : string;
    
    @Prop({
        required: true
    })
    attendance : number;
    
    @Prop({
        type: [{ token: { type: String, required: true } }],
      })
      tokens: Array<{ token: string }>
}


export const StudentSchema = SchemaFactory.createForClass(Student)
export const StudentModel = mongoose.model('Student', StudentSchema)

