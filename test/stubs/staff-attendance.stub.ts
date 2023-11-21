
import { staffStub } from "./staff.stub"
import { ObjectId } from "bson"

export const staffAttendanceStub = ()  => {
    return {
        _id : new ObjectId("6556e8102b46d2294e9644dc"),
        date: "2021-06-18T00:00:00.000Z",
        status: false,
        roleOfUser: "Staff",
        userId: staffStub()._id,
    }  
}