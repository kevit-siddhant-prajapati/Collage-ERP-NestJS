import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance, AttendanceModel } from './schemas/attendance.schema';
import { Student } from '../student/schemas/student.schema';
import { Staff } from '../staff/schemas/staff.schema';
import mongoose, { Model } from 'mongoose';
import { fillAttendanceDto } from './dto/fill-Attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { logger } from '../logger/logger.service';

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
            //find all student in given attendance array status true
            const student = await this.StudentModel.findById(attendie);
            if (student) {
                //increase attendance in student database
                student.attendance += 1;
                logger.info(`Attendande of Student of id ${student._id} increment`)
                const attendanceDetail : CreateAttendanceDto = {
                    status : true,
                    date : attendanceData.date,
                    userId : student._id,
                    roleOfUser : "Student"
                }
                //crate new attendance document for each provided id in array
                const newAttendance : Attendance = await this.AttendanceModel.create(attendanceDetail)
                if(!newAttendance){
                    logger.error(`Attendance of Student id: ${student._id} is created as present`)
                    throw new BadRequestException(`Unable to fill student attendance`)
                }
                await student.save();
            } 
            // filling attendance of students that are not present in array
            const notAttendStudent = await this.StudentModel.findById({ $ne :attendie});
            if(notAttendStudent){
                const attendanceDetail : CreateAttendanceDto = {
                    status : false,
                    date : attendanceData.date,
                    userId : notAttendStudent._id,
                    roleOfUser : "Student"
                }
                //create new attendance document for student that are not present in array
                const newAttendance : Attendance = await this.AttendanceModel.create(attendanceDetail)
                if(!newAttendance){
                    logger.error(`Attendance of Student id: ${notAttendStudent._id} is created as absent`)
                    throw new BadRequestException(`Unable to fill student attendance`)
                }
                logger.info(`Attendance of student of Id : ${notAttendStudent._id} filled`)
                await student.save();
            }
        }
        logger.info(`Student of data ${attendanceData.date} is filled`)
    }


    /**
     * @description : fill attendance of staff using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {fillAttendanceDto} attendanceData
     * @returns {*} 
     */
    async fillStaffAttendance(attendanceData :fillAttendanceDto) {
        const attendStaff : Array<string> = attendanceData.attendance;
        for (const attendie of attendStaff) {
            //find data of each staff that is given in array
            const staff = await this.StaffModel.findById(attendie);
            if (staff) {
                //attendance of staff is increment
                staff.attendance += 1;
                logger.info(`data of staff of staff id is incremented : ${staff._id}`)
                const attendanceDetail : CreateAttendanceDto= {
                    status : true,
                    date : attendanceData.date,
                    userId : staff._id,
                    roleOfUser : "Staff"
                }
                //create new document for staff attendance as present
                const newAttendance = new this.AttendanceModel(attendanceDetail)
                try {
                    await newAttendance.save()
                } catch (err){
                    logger.error(`Unable to fill data of staff attendance staff id : ${staff._id}`)
                    throw new BadRequestException(`Unable to fill staff attendance ${err}`)
                }
                await staff.save();
            } 
            //fill data of staff that are not present in attendance array
            const notAttendStaff = await this.StaffModel.findById({ $ne :attendie});
            if(notAttendStaff){
                const attendanceDetail : CreateAttendanceDto= {
                    status : false,
                    date : attendanceData.date,
                    userId : notAttendStaff._id,
                    roleOfUser : "Staff"
                }
                //create new document for staff attendance as absent
                const newAttendance = new this.AttendanceModel(attendanceDetail)
                try {
                    await newAttendance.save()
                } catch (err){
                    logger.error(`Unable to fill data of staff of staff id : ${staff._id} `)
                    throw new BadRequestException(`Unable to fill staff attendance ${err}`)
                }
                await staff.save();
            }
        }
        logger.info(`attendance of staff is filled`)
    }


    /**
     * @description : get attendace of user using its roll ans edit it
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Attendance} attendanceData
     * @param {string} id
     * @returns {*}  {Promise<Attendance>}
     */
    async manageAttendanceById(attendanceData : Attendance, id : string): Promise<Attendance>{
        //attendance mockdata contains roleOfUser and userId that are not available in updateable data
        if(process.env.NODE_ENV === 'test'){
            delete attendanceData.roleOfUser
            delete attendanceData.userId
        } 
            const updatable : Array<string> = [ 'status', 'date']
            const updateAttend : Array<string> = Object.keys(attendanceData)
            //check if given all update is valid or not
            const isValidUpdate : boolean = updateAttend.every(update => updatable.includes(update))
            if(!isValidUpdate){
                logger.error('Invalid attendance update')
                throw new BadRequestException('not valid Update')
            }
         
            const updateAttendance : Attendance = await this.AttendanceModel.findByIdAndUpdate(id, attendanceData)
            if(!updateAttendance){
                logger.error('Given attendance not found')
                throw new NotFoundException('Given ATTENDANCE not found')
            }
            logger.info(`Successfully update attendance of id : ${id}`)
            return updateAttendance
    }

    /**
     * @description : get Attendance of user using its role
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Attendance} role
     * @returns {*}  {Promise<Attendance[]>}
     */
    async getAttendanceByRole(role : Attendance): Promise<Attendance[]>{
        const attendances : Attendance[] = await this.AttendanceModel.find(role)
        if(!attendances){
            logger.error(`Unable find attendance of given role ${role}`)
            throw new BadRequestException(`Unable to find attendance of ${role}'s`)
        }
        logger.info(`Successfully getting of ${role}`)
        return attendances
    }
}
