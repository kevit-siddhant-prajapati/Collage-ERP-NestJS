import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common'
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/crete-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService : AdminService;
  let app : INestApplication

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({

      controllers : [AdminController],
      providers : [
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
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
      ],

    }).compile()

    adminService = await moduleRef.get<AdminService>(AdminService)
    adminController = await moduleRef.get<AdminController>(AdminController)
  });


  describe('getAlladmins', () => {
    it('should return array of admin', async () => {
      const result: any = 
      [
        {
          name: "Karina",
          email: "kerina@admin.com",
          password: 'Kerina@12',
          tokens : []
      },
      {
          name: "Ritu",
          email: "ritu@admin.com",
          password: 'Ritu@1234',
          tokens : []
      }
      ]
      jest.spyOn(adminService, 'findAll').mockResolvedValue(result);

      expect(await adminController.getAllAdmins()).toBe(result);
    })

    describe('getAdminById', () => {
      it('should return a admin by ID', async () => {
        const result: any = {
          name:"Mike",
          email:"Mike@admin.com",
          password:"Mike@1234",
          tokens : []
        };

        jest.spyOn(adminService, 'findById').mockResolvedValue(result);
  
        expect(await adminController.getAdminById('654c92beaff73f84314a2400')).toBe(result);
      });
    });
  
    describe('addAdmin', () => {
      it('should create a new admin', async () => {
        const createAdmin: CreateAdminDto = {
          name: "Maya",
          email: "maya@example.com",
          password: 'Maya@1234',
          _id: "6549be3dc6d51a63cad00340",
          tokens: []
        };
        const result: any = {};
        jest.spyOn(adminService, 'createOne').mockResolvedValue(result);
  
        expect(await adminController.addAdmin(createAdmin)).toBe(result);
      });
    });
  
    describe('updateAdmin', () => {
      it('should update a admin by ID', async () => {
        const updateAdmin: UpdateAdminDto = {
          name: "Jaya",
          email: "jaya@example.com",
          _id: '6549be3dc6d51a63cad00340',
          password: 'Jaya@1234',
          tokens: []
        };
        const result: any = {};
        jest.spyOn(adminService, 'updateOne').mockResolvedValue(result);
  
        expect(await adminController.updateAdmin(updateAdmin, '6549be3dc6d51a63cad00340')).toBe(result);
      });
    });
  
    describe('deleteStaff', () => {
      it('should delete a student by ID', async () => {
        const result: any = {};
        jest.spyOn(adminService, 'deleteOne').mockResolvedValue(result);
  
        expect(await adminController.deleteAdmin('6549be3dc6d51a63cad00340')).toBe(result);
      });
    });


  })
});
