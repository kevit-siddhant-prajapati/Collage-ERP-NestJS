import { Controller, Get, Post, Patch, Delete, Body, HttpCode, Param, UseInterceptors } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from './schemas/staff.schema';
import { CreateStaffDto } from './dto/crete-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ParseObjectIdPipe } from '../student/pipe/ParseObjectId.pipe';


@Controller('staffs')
export class StaffController {
    constructor(private staffService : StaffService){}

    /**
     * @description : get data of all staff
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @returns {*}  {Promise<Staff[]>}
     */
    @Get('all')
    async getAllStaffs() : Promise<Staff[]> {
        return this.staffService.findAll()
    }

    /**
     * @description : get data of staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} id
     * @returns {*}  {Promise<Staff>}
     */
    @Get('get/:id')
    async getStaffById(@Param('id', new ParseObjectIdPipe()) id: string) : Promise<Staff> {
        return this.staffService.findById(id)
    }

    /**
     * @description : create new staff
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {CreateStaffDto} input
     * @returns {*}  {Promise<Staff>}
     */
    @Post('new')
    async addStaff(@Body() input: CreateStaffDto) : Promise<Staff> {
        return this.staffService.createOne(input)
    }

    /**
     * @description : update staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {UpdateStaffDto} staff
     * @param {string} id
     * @returns {*}  {Promise<Staff>}
     */
    @Patch('/update/:id')
    async updateStaff(
        @Body() staff: UpdateStaffDto,
        @Param('id', new ParseObjectIdPipe()) id: string
        ) : Promise<Staff> {
        return this.staffService.updateOne(id, staff)
    }

    /**
     * @description : delete staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @returns {*} 
     */
    @Delete('/delete/:id')
    @HttpCode(204)
    async deleteStaff(
        @Param('id', new ParseObjectIdPipe()) id: string
    ) {
        return this.staffService.deleteOne(id)
    }
}
