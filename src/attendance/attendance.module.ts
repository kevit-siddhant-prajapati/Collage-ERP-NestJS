import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './schemas/attendance.schema';
import { StudentSchema } from 'src/student/schemas/student.schema';
import { StaffSchema } from 'src/staff/schemas/staff.schema';
import { AdminAuthMiddleware } from 'src/auth/auth.middleware';
import { AdminSchema } from 'src/admin/schemas/admin.schema';


@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Attendance', schema : AttendanceSchema},
      { name: 'Staff', schema : StaffSchema},
      { name: 'Student', schema : StudentSchema},
      { name: 'Admin', schema : AdminSchema }
    ]),
    // StudentModule,
    // StaffModule,
],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports : [AttendanceService]
})
export class AttendanceModule {
  configure(consumer : MiddlewareConsumer){
    consumer
    .apply(AdminAuthMiddleware)
    .forRoutes(
      {path : 'attendance/get' , method : RequestMethod.GET},
      {path : 'attendance/fill' , method : RequestMethod.POST},
      {path : 'attendance/update/:id' , method : RequestMethod.PATCH},
    )
  }
}
