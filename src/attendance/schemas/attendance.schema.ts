import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { Mongoose } from "mongoose";
import { AdminSchema } from "src/admin/schemas/admin.schema";
import * as bcrypt from "bcrypt"

@Schema()
export class Attendance{
    @Prop({
        required: true
    })
    date : Date;

    @Prop({
        default : false
    })
    status : boolean;

    @Prop({
        required :true,
        validate(value:string){
            const roles = ['Student' , 'Staff']
            if(roles.indexOf(value) === -1){
                throw new Error('Enter valid role')
            }
        }
    })
    roleOfUser : string;

    @Prop({
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Student"
    })
    userId : mongoose.Types.ObjectId;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance)
export const AttendanceModel = mongoose.model("Attendance", AttendanceSchema)

AdminSchema.pre('save', async function (next) {
    const admin = this;
    try {
        //check if password is change or not
        if (admin.isModified('password')) {
            const hashedpassword = await bcrypt.hash(admin.password, 8); //generate hash password from student's password 
            admin.password = hashedpassword.toString();  //overwrite hash password in student password
        }
        next();
    } catch (error) {
        next(error);
    }
});