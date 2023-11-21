
import { studentStub } from "./students.stub";
import { ObjectId } from "bson";

export const studentAttendanceStub = ()  => {
    return {
        _id : new ObjectId("6556e8102b46d2294e9644f2"),
        date: "2021-06-18T00:00:00.000Z",
        status: false,
        roleOfUser: "Student",
        userId: studentStub()._id,
        }  
}