import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { StaffSchema } from 'src/staff/schemas/staff.schema';
import { StudentSchema } from 'src/student/schemas/student.schema';
import { AdminSchema } from 'src/admin/schemas/admin.schema';
/**
 * @description : module use for authentication user as well as authorization user
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class AuthModule
 */
@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Staff', schema : StaffSchema},
      { name: 'Student', schema : StudentSchema},
      { name: 'Admin', schema : AdminSchema}
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}