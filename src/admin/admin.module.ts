import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schemas/admin.schema';
import { AdminAuthMiddleware } from '../auth/auth.middleware';
import { StudentSchema } from '../student/schemas/student.schema';
import { StaffSchema } from '../staff/schemas/staff.schema';
/**
 * @description : import AdminSchema and connect controller and service
 * @author Siddhant Prajapati
 * @export
 * @class AdminModule
 */
@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Admin', schema : AdminSchema},
      { name: 'Student', schema : StudentSchema},
      { name: 'Staff' , schema : StaffSchema}
    ])
  ],
  providers: [AdminService, JwtService],
  controllers: [AdminController]
})

export class AdminModule {
  /**
   * @description : set AdminAuthMiddleware for following given routes
   * @author Siddhant Prajapati
   * @param {MiddlewareConsumer} consumer
   */
  configure(consumer : MiddlewareConsumer){
    consumer
    .apply(AdminAuthMiddleware)
    .forRoutes(
      {path : 'admin/:id' , method : RequestMethod.GET},
      {path : 'admin/new' , method : RequestMethod.POST},
      {path : 'admin/update/:id' , method : RequestMethod.PATCH},
      {path : 'admin/delete/:id' , method : RequestMethod.DELETE},
      {path : 'admin/all' , method : RequestMethod.GET}
    )
  }
}
