import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './schemas/attendance.schema';
import { StudentSchema } from '../student/schemas/student.schema';
import { StaffSchema } from '../staff/schemas/staff.schema';
import { AdminAuthMiddleware } from '../auth/auth.middleware';
import { AdminSchema } from '../admin/schemas/admin.schema';

/**
 * @description : this model import model of all type of user 
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class AttendanceModule
 */
@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Attendance', schema : AttendanceSchema},
      { name: 'Staff', schema : StaffSchema},
      { name: 'Student', schema : StudentSchema},
      { name: 'Admin', schema : AdminSchema }
    ]),
],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports : [AttendanceService]
})


export class AttendanceModule {
  /**
   * @description : below given method set AdminAuthmiddleware with routes
   * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
   * @param {MiddlewareConsumer} consumer
   */
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
