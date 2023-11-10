import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common'
import { AdminService } from '../admin/admin.service';

import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { ObjectId } from 'bson';

describe('AttendanceController', () => {
  let attendanceController: AttendanceController;
  let attendanceService : AttendanceService;
  let app : INestApplication

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({

      controllers : [AttendanceController],
      providers : [
        AttendanceService,
        AdminService,
        JwtService,
        AuthService,
        {
          provide: 'StudentModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
        {
          provide: 'StaffModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
        {
          provide: 'AttendanceModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your AttendanceModel
        },
        {
          provide: 'AdminModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your AttendanceModel
        },
      ],

    }).compile()

    attendanceService = await moduleRef.get<AttendanceService>(AttendanceService)
    attendanceController = await moduleRef.get<AttendanceController>(AttendanceController)
  });


    describe('getUserByRole', () => {
      it('should return attendance of staff', async () => {
        const result: any = {
            roleOfUser : "Staff"
        }
        
        jest.spyOn(attendanceService, 'getAttendanceByRole').mockResolvedValue(result);
        expect(await attendanceController.getUserByRole(result)).toBe(result);
      })
    })

    describe('updateUserAttendance', () => {
      it('manage attendance of User', async () => {
        const manageAttendance : any = {
          date : new Date('2021-06-20'),
          roleOfUser : 'Staff',
          status : true,
          userId : new ObjectId("6533635e9144267850a79b38")
        }
        
        jest.spyOn(attendanceService, 'manageAttendanceById').mockResolvedValue(manageAttendance);
        expect(await attendanceController.updateUserAttendance(manageAttendance, manageAttendance.userId)).toBe(manageAttendance);
      })
    })
  
    
  })


