import { IsString, IsOptional } from 'class-validator';
/**
 * @description : this dto give information as well restrict admin when it is created
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateAdminDto
 */
export class CreateAdminDto {

    @IsOptional()
    _id : string | undefined;
    @IsString()
    name :string

    @IsString()
    email:string

    @IsString()
    password:string

    @IsOptional()
    tokens : Array<{ token: string }>
}