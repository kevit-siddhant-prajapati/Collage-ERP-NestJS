import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModel, StaffSchema } from './schemas/staff.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports : [
    MongooseModule.forFeature([{ name: 'Staff', schema : StaffSchema}]),
    StaffModel
  ],
  providers: [StaffService, JwtService],
  controllers: [StaffController],
  exports : [StaffService, MongooseModule.forFeature([{ name: 'Staff', schema : StaffSchema}])]
})
export class StaffModule {

}
