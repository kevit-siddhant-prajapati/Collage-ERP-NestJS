/**
 * @description : give outputformat of analysis4
 * @author Siddhant Prajapati
 * @export
 * @class Analysis4Dto
 */
export class Analysis4Dto {
    totalStudents : number;
    totalStudentsIntake : number;
    availableIntake : number;
    branches : {
        ME : {
            totalStudents : number;
            totalStudentsIntake : Array<Number>;
            availableIntake : number;
        };
        EC : {
            totalStudents : number;
            totalStudentsIntake : Array<Number>;
            availableIntake : number;
        };
        CE : {
            totalStudents : number;
            totalStudentsIntake : Array<Number>;
            availableIntake : number;
        }
    }
}