import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schemas/admin.schema';

@Module({
  imports : [MongooseModule.forFeature([{ name: 'Admin', schema : AdminSchema}])],
  providers: [AdminService, JwtService],
  controllers: [AdminController]
})
export class AdminModule {}
