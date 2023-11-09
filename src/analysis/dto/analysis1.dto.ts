
/**
 * @description : Give output format of analysis1
 * @author Siddhant Prajapati
 * @export
 * @class Analysis1Dto
 */
export class Analysis1Dto {
    totalStudents : number;
    year : number;
    branches : {
        CE : number;
        EC : number;
        ME : number;
    }
}