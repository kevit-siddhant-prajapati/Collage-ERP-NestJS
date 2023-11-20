import { IsString, IsOptional } from 'class-validator';
/**
 * @description : this dto number of that can be change when update admin
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class UpdateAdminDto
 */
export class UpdateAdminDto {

    @IsOptional()
    _id : string | undefined;

    @IsString()
    readonly name :string

    @IsOptional()
    @IsString()
    readonly email:string

    @IsOptional()
    @IsString()
    readonly password:string

    @IsOptional()
    tokens : Array<{ token: string }>
}