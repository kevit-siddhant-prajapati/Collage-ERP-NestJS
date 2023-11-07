import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

/**
 * @description : usefull to create new attendance
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateAttendanceDto
 */
export class CreateAttendanceDto {
    @IsDate()
    readonly date : Date;

    @IsBoolean()
    readonly status : boolean;

    @IsString()
    readonly roleOfUser : string;

    @IsOptional()
    readonly userId : mongoose.Types.ObjectId;
}