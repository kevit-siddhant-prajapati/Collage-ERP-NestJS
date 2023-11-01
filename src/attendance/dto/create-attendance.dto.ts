import mongoose from "mongoose";

export class CreateAttendanceDto {
    readonly date : Date;
    readonly status : boolean;
    readonly roleOfUser : string;
    readonly userId : mongoose.Types.ObjectId;
}