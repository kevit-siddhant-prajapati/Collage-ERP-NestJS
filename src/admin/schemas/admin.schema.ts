import { Schema, Prop, SchemaFactory, raw } from "@nestjs/mongoose";
import validator from "validator";
import mongoose from "mongoose";
/**
 * @description : Student schema give property for generate new admin as well as perform CRUD operation
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class Admin
 */
@Schema({
    timestamps :true
})
export class Admin{
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
        type: [{ token: { type: String, required: true } }],
        required: true,
      })
      tokens: Array<{ token: string }>;

}

export const AdminSchema = SchemaFactory.createForClass(Admin)
export const AdminModel = mongoose.model('Admin', AdminSchema)