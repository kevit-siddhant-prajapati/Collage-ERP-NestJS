import { Controller, Get, Post, Patch, Delete, Body, HttpCode, Param } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from './schemas/staff.schema';
import { CreateStaffDto } from './dto/crete-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';


@Controller('staffs')
export class StaffController {
    constructor(private staffService : StaffService){}

    @Get()
    async getAllStaffs() : Promise<Staff[]> {
        return this.staffService.findAll()
    }


    @Get('/:id')
    async getStaffById(@Param('id') id) : Promise<Staff> {
        return this.staffService.findById(id)
    }

    @Post('new')
    async addStaff(@Body() input: CreateStaffDto) : Promise<Staff> {
        return this.staffService.createOne(input)
    }

    @Patch('/update/:id')
    async updateStaff(
        @Body() staff: UpdateStaffDto,
        @Param('id') id: string
        ) : Promise<Staff> {
        return this.staffService.updateOne(id, staff)
    }

    @Delete('/delete/:id')
    @HttpCode(204)
    async deleteStaff(
        @Param('id') id: string
    ) {
        return this.staffService.deleteOne(id)
    }
}
