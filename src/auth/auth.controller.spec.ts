import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common'
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceController } from '../attendance/attendance.controller';
import { AttendanceService } from '../attendance/attendance.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService : AuthService;
  let app : INestApplication

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({

      controllers : [AuthController],
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

    authService = await moduleRef.get<AuthService>(AuthService)
    authController = await moduleRef.get<AuthController>(AuthController)
  });


    describe('loginUser', () => {
      it('authenticatate admin should login', async () => {
        const result: any = {
            email : "siddhant@admin.com",
            password: "Siddhant@1",
            role : "Admin"
        }
        
        jest.spyOn(authService, 'loginAdmin').mockResolvedValue(result);
        expect(await authController.loginUser(result)).toBe(result);
      })
    })

    describe('loginUser', () => {
      it('authenticatate staff should login', async () => {
        const result: any = {
            email : "ajay@admin.com",
            password: "Ajay@1234",
            role : "Staff"
        }
        
        jest.spyOn(authService, 'loginStaff').mockResolvedValue(result);
        expect(await authController.loginUser(result)).toBe(result);
      })
    })

    describe('loginUser', () => {
      it('authenticatate student should login', async () => {
        const result: any = {
            email : "vijay@admin.com",
            password: "Vijay@1234",
            role : "Student"
        }
        
        jest.spyOn(authService, 'loginStudent').mockResolvedValue(result);
        expect(await authController.loginUser(result)).toBe(result);
      })
    })

    describe('logoutUser', () => {
      it('should logout all users', async () => {
        jest.spyOn(authService, 'logout').mockResolvedValue();
        
        // Call the correct method: logoutUser instead of loginUser
        await authController.logoutUser();
        
        // Add assertions or expectations as needed
        expect(authService.logout).toHaveBeenCalled();
      });
    });
    
  })


