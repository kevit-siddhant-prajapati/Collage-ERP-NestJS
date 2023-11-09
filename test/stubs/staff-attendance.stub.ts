import mongoose from "mongoose"
import { staffStub } from "./staff.stub"

export const staffAttendanceStub = ()  => {
    return {
        _id : new mongoose.Types.ObjectId(),
        date: "2021-06-18T00:00:00.000Z",
        status: false,
        roleOfUser: "Staff",
        userId: staffStub()._id,
    }  
}