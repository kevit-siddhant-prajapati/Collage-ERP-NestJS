

export class CreateAdminDto {
    readonly name :string
    readonly email:string
    readonly password:string
    tokens : Array<{ token: string }>
}