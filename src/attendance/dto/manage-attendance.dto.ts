import mongoose from "mongoose";

export class ManageAttendanceDto {
     date : Date;
     status : boolean;
     roleOfUser : string;
     userId : mongoose.Types.ObjectId;
}