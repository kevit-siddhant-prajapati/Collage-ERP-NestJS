import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/crete-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService : AdminService){}

    @Get()
    async getAllAdmins() : Promise<Admin[]> {
        return this.adminService.findAll()
    }


    @Get('/:id')
    async getAdminById(@Param('id') id) : Promise<Admin> {
        return this.adminService.findById(id)
    }

    @Post('new')
    async addAdmin(@Body() input: CreateAdminDto) : Promise<Admin> {
        return this.adminService.createOne(input)
    }

    @Patch('/update/:id')
    async updateAdmin(
        @Body() admin: UpdateAdminDto,
        @Param('id') id: string
        ) : Promise<Admin> {
        return this.adminService.updateOne(id, admin)
    }

    @Delete('/delete/:id')
    @HttpCode(204)
    async deleteAdmin(
        @Param('id') id: string
    ) {
        return this.adminService.deleteOne(id)
    }
}
