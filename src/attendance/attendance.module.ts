import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceModel, AttendanceSchema } from './schemas/attendance.schema';
import { JwtService } from '@nestjs/jwt';
import { StaffModule } from 'src/staff/staff.module';
import { StudentModule } from 'src/student/student.module';
import { StudentModel } from 'src/student/schemas/student.schema';
import { StaffModel } from 'src/staff/schemas/staff.schema';
import { StudentService } from 'src/student/student.service';
import { StaffService } from 'src/staff/staff.service';

@Module({
  imports : [
    MongooseModule.forFeature([{ name: 'Attendance', schema : AttendanceSchema}]),
    StudentModule,
    StaffModule,
],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports : [AttendanceService]
})
export class AttendanceModule {}
