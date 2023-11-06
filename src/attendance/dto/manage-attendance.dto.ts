import { IsBoolean, IsDate, IsString } from "class-validator";
import mongoose from "mongoose";

export class ManageAttendanceDto {
     @IsDate()
     date : Date;

     @IsBoolean()
     status : boolean;

     @IsString()
     roleOfUser : string;
     userId : mongoose.Types.ObjectId;
}