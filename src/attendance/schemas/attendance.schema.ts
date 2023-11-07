import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { Mongoose } from "mongoose";
/**
 * @description : attendance schema is useful to perform CRUD operation on attendance
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class Attendance
 */
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
