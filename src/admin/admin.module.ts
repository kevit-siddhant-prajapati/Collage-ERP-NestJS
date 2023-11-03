import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schemas/admin.schema';
import { AdminAuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports : [MongooseModule.forFeature([{ name: 'Admin', schema : AdminSchema}])],
  providers: [AdminService, JwtService],
  controllers: [AdminController]
})
export class AdminModule {
  configure(consumer : MiddlewareConsumer){
    consumer
    .apply(AdminAuthMiddleware)
    .forRoutes(
      {path : 'admin' , method : RequestMethod.GET},
      {path : 'admin/new' , method : RequestMethod.POST},
      {path : 'admin/update' , method : RequestMethod.PATCH},
      {path : 'admin/delete' , method : RequestMethod.DELETE},
      {path : 'admin/all' , method : RequestMethod.GET}
    )
  }
}
