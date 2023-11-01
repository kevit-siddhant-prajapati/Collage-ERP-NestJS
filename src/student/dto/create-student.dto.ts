

export class CreateStudentDto {
    readonly name :string
    readonly email:string
    readonly currentSem:number
    readonly password:string
    readonly phoneNumber : string
    readonly batch : number
    readonly department : string
    readonly attendance : number
    tokens : Array<{ token: string }>
}