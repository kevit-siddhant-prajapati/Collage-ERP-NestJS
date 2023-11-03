import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModel, StaffSchema } from './schemas/staff.schema';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthMiddleware, StaffAuthMiddleware } from 'src/auth/auth.middleware';
import { AdminModule } from 'src/admin/admin.module';
import { AdminSchema } from 'src/admin/schemas/admin.schema';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Staff', schema : StaffSchema},
      { name: 'Admin', schema : AdminSchema}
    ]),
    AdminModule,
  ],
  providers: [StaffService, JwtService],
  controllers: [StaffController],
   exports : [StaffService]
})
export class StaffModule {
  configure(consumer : MiddlewareConsumer){
    consumer
      .apply(StaffAuthMiddleware)
      .forRoutes(
        {path : 'staffs/all' , method : RequestMethod.GET},
      )

    consumer
    .apply(AdminAuthMiddleware)
    .forRoutes(
      {path : 'staffs' , method : RequestMethod.GET},
      {path : 'staffs/new' , method : RequestMethod.POST},
      {path : 'staffs/update' , method : RequestMethod.PATCH},
      {path : 'staffs/delete' , method : RequestMethod.DELETE}
    )
  }
}
