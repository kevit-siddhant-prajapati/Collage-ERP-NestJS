

export class CreateStaffDto {
    readonly name :string
    readonly email:string
    readonly password:string
    readonly phoneNumber : string
    readonly department : string
    readonly attendance : number
    tokens : Array<{ token: string }>
}