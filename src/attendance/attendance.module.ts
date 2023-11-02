import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './schemas/attendance.schema';
import { StudentSchema } from 'src/student/schemas/student.schema';
import { StaffSchema } from 'src/staff/schemas/staff.schema';


@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Attendance', schema : AttendanceSchema},
      { name: 'Staff', schema : StaffSchema},
      { name: 'Student', schema : StudentSchema}
    ]),
      
    // StudentModule,
    // StaffModule,
],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports : [AttendanceService]
})
export class AttendanceModule {}
