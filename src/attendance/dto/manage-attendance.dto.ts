import { IsBoolean, IsDate, IsMongoId, IsString } from "class-validator";
import mongoose from "mongoose";
/**
 * @description : this dto manage attendance using different fields
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class ManageAttendanceDto
 */
export class ManageAttendanceDto {

     @IsDate()
     date : Date;

     @IsBoolean()
     status : boolean;

     @IsString()
     roleOfUser : string;

     @IsMongoId()
     userId : mongoose.Types.ObjectId;
}

