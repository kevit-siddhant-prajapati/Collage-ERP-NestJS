
import mongoose from "mongoose";
import { studentStub } from "./students.stub";

export const studentAttendanceStub = ()  => {
    return {
        _id : new mongoose.Types.ObjectId(),
        date: "2021-06-18T00:00:00.000Z",
        status: false,
        roleOfUser: "Student",
        userId: studentStub()._id,
        }  
}