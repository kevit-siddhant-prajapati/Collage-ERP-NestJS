import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Student } from 'src/student/schemas/student.schema';
import { Staff } from 'src/staff/schemas/staff.schema';
import mongoose, { Model } from 'mongoose';
import { fillAttendanceDto } from './dto/fill-Attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ManageAttendanceDto } from './dto/manage-attendance.dto';

@Injectable()
export class AttendanceService {
    
    constructor(
        @InjectModel(Student.name) private readonly StudentModel : Model<Student>,
        @InjectModel(Staff.name) private readonly StaffModel : Model<Student>,
        @InjectModel(Attendance.name) private readonly AttendanceModel : Model<Attendance>
    ){}

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
                    //return res.status(400).send(`Unable to fill student attendance ${err}`)
                    throw new BadRequestException(`Unable to fill student attendance`)
                }
                await student.save();
                //studentsLogger.info(`Attendance filled : ${student._id}`)
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
                    //return res.status(400).send(`Unable to fill student attendance ${err}`)
                    throw new BadRequestException(`Unable to fill student attendance`)
                }
                await student.save();
                //studentsLogger.info(`Attendance filled : ${notAttendStudent._id}`)
            }
        }
        return "attendance of Student Filled Successfully"
    }


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
                    //return res.status(400).send(`Unable to fill student attendance ${err}`)
                    throw new BadRequestException(`Unable to fill staff attendance ${err}`)
                }
                await staff.save();
                //studentsLogger.info(`Attendance filled : ${student._id}`)
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
                    //return res.status(400).send(`Unable to fill student attendance ${err}`)
                    throw new BadRequestException(`Unable to fill staff attendance ${err}`)
                }
                await staff.save();
                //studentsLogger.info(`Attendance filled : ${notAttendStudent._id}`)
            }
        }
        return "attendance of Staff Filled Successfully"
    }


    async manageAttendanceById(attendanceData : Attendance, id : string): Promise<Attendance>{
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
    }

    async getAttendanceByRole(role : Attendance): Promise<Attendance[]>{
        const attendances = await this.AttendanceModel.find(role)
        if(!attendances){
            throw new BadRequestException(`Unable to find attendance of ${role}'s`)
        }
        return attendances
    }
}
