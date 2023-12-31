import { Schema, Prop, SchemaFactory, raw } from "@nestjs/mongoose";
import validator from "validator";
import mongoose from "mongoose";
import { IsOptional } from "class-validator";

/**
 * @description : Student schema give property for generate new student
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class Staff
 */
@Schema({
    timestamps :true
})
export class Staff{
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
        required: true,
      })

    @IsOptional()
    tokens: Array<{ token: string }>;

}

export const StaffSchema = SchemaFactory.createForClass(Staff)
export const StaffModel = mongoose.model('Staff', StaffSchema)
