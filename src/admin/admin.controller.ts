import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/crete-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ParseObjectIdPipe } from 'src/student/pipe/ParseObjectId.pipe';

@Controller('admin')
export class AdminController {
    constructor(private adminService : AdminService){}
/**
 * @description : this route give data all admin
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @returns {*}  {Promise<Admin[]>}
 */
@Get('all')
    async getAllAdmins() : Promise<Admin[]> {
        return this.adminService.findAll()
    }

    /**
     * @description : this route find bby its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} id
     * @returns {*}  {Promise<Admin>}
     */
    @Get('/:id')
    async getAdminById(@Param('id', new ParseObjectIdPipe()) id) : Promise<Admin> {
        return this.adminService.findById(id)
    }

    /**
     * @description : this route create new admin
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {CreateAdminDto} input
     * @returns {*}  {Promise<Admin>}
     */
    @Post('new')
    async addAdmin(@Body() input: CreateAdminDto) : Promise<Admin> {
        return this.adminService.createOne(input)
    }

    /**
     * @description : Update admin using its id 
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {UpdateAdminDto} admin
     * @param {string} id
     * @returns {*}  {Promise<Admin>}
     */
    @Patch('/update/:id')
    async updateAdmin(
        @Body() admin: UpdateAdminDto,
        @Param('id', new ParseObjectIdPipe()) id: string
        ) : Promise<Admin> {
        return this.adminService.updateOne(id, admin)
    }

    /**
     * @description : delete admin using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @returns {*} 
     */
    @Delete('/delete/:id')
    @HttpCode(204)
    async deleteAdmin(
        @Param('id', new ParseObjectIdPipe()) id: string
    ) {
        return this.adminService.deleteOne(id)
    }
}
