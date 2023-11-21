import { Student } from "../../student/schemas/student.schema";
/**
 * @description : give output format of analysis3
 * @author Siddhant Prajapati
 * @export
 * @class Analysis3Dto
 */
export class Analysis3Dto {
    date : Date;
    userId : string;
    attendanceData : Array<Student>
}