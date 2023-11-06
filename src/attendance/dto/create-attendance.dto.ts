import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

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