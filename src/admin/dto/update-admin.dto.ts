

export class UpdateAdminDto {
    readonly name :string
    readonly email:string
    readonly password:string
    tokens : Array<{ token: string }>
}