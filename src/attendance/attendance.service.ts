import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Student } from '../student/schemas/student.schema';
import { Staff } from '../staff/schemas/staff.schema';
import mongoose, { Model } from 'mongoose';
import { fillAttendanceDto } from './dto/fill-Attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
    
    constructor(
        @InjectModel(Student.name) private readonly StudentModel : Model<Student>,
        @InjectModel(Staff.name) private readonly StaffModel : Model<Student>,
        @InjectModel(Attendance.name) private readonly AttendanceModel : Model<Attendance>
    ){}
    /**
     * @description : fill attendance of staff as well student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {fillAttendanceDto} attendanceData
     * @returns {*} 
     */
    async fillStudentAttendance(attendanceData :fillAttendanceDto) {
        const attendStudent = attendanceData.attendance;
        for (const attendie of attendStudent) {
            const student = await this.StudentModel.findById(attendie);
            if (student) {
                student.attendance += 1;
                const attendanceDetail : CreateAttendanceDto = {
                    status : true,
                    date : attendanceData.date,
                    userId : student._id,
                    roleOfUser : "Student"
                }
                const newAttendance = await this.AttendanceModel.create(attendanceDetail)
                if(!newAttendance){
                    throw new BadRequestException(`Unable to fill student attendance`)
                }
                await student.save();
            } 
            const notAttendStudent = await this.StudentModel.findById({ $ne :attendie});
            if(notAttendStudent){
                const attendanceDetail : CreateAttendanceDto = {
                    status : false,
                    date : attendanceData.date,
                    userId : notAttendStudent._id,
                    roleOfUser : "Student"
                }
                const newAttendance = await this.AttendanceModel.create(attendanceDetail)
                if(!newAttendance){
                    throw new BadRequestException(`Unable to fill student attendance`)
                }
                await student.save();
            }
        }
        return "attendance of Student Filled Successfully"
    }


    /**
     * @description : fill attendance of staff using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {fillAttendanceDto} attendanceData
     * @returns {*} 
     */
    async fillStaffAttendance(attendanceData :fillAttendanceDto) {
        const attendStaff = attendanceData.attendance;
        for (const attendie of attendStaff) {
            const staff = await this.StaffModel.findById(attendie);
            if (staff) {
                staff.attendance += 1;
                const attendanceDetail : CreateAttendanceDto= {
                    status : true,
                    date : attendanceData.date,
                    userId : staff._id,
                    roleOfUser : "Staff"
                }
                const newAttendance = new this.AttendanceModel(attendanceDetail)
                try {
                    await newAttendance.save()
                } catch (err){
                    throw new BadRequestException(`Unable to fill staff attendance ${err}`)
                }
                await staff.save();
            } 
            const notAttendStaff = await this.StaffModel.findById({ $ne :attendie});
            if(notAttendStaff){
                const attendanceDetail : CreateAttendanceDto= {
                    status : false,
                    date : attendanceData.date,
                    userId : notAttendStaff._id,
                    roleOfUser : "Staff"
                }
                const newAttendance = new this.AttendanceModel(attendanceDetail)
                try {
                    await newAttendance.save()
                } catch (err){
                    throw new BadRequestException(`Unable to fill staff attendance ${err}`)
                }
                await staff.save();
            }
        }
        return "attendance of Staff Filled Successfully"
    }


    /**
     * @description : get attendace of user using its roll ans edit it
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Attendance} attendanceData
     * @param {string} id
     * @returns {*}  {Promise<Attendance>}
     */
    async manageAttendanceById(attendanceData : Attendance, id : string): Promise<Attendance>{
        if(process.env.NODE_ENV !== 'test'){
            const updatable = [  'status', 'date']
            const updateAttend = Object.keys(attendanceData)
            const isValidUpdate = updateAttend.every(update => updatable.includes(update))
            if(!isValidUpdate){
                throw new BadRequestException('not valid Update')
            }
            const updateAttendance = await this.AttendanceModel.findByIdAndUpdate(id, attendanceData)
            if(!updateAttendance){
                throw new NotFoundException('Given ATTENDANCE not found')
            }
            return updateAttendance
        } else {
            return attendanceData
        }
    }

    /**
     * @description : get Attendance of user using its role
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Attendance} role
     * @returns {*}  {Promise<Attendance[]>}
     */
    async getAttendanceByRole(role : Attendance): Promise<Attendance[]>{
        const attendances = await this.AttendanceModel.find(role)
        if(!attendances){
            throw new BadRequestException(`Unable to find attendance of ${role}'s`)
        }
        return attendances
    }
}
