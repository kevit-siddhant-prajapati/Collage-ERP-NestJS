import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common'
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/crete-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

describe('StaffController', () => {
  let staffController: StaffController;
  let staffService : StaffService;
  let app : INestApplication

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({

      controllers : [StaffController],
      providers : [StaffService,

        {
          provide: 'AttendanceModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your AttendanceModel
        },
        {
          provide: 'StaffModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
      ],

    }).compile()

    staffService = await moduleRef.get<StaffService>(StaffService)
    staffController = await moduleRef.get<StaffController>(StaffController)
  });


  describe('getAllStaffs', () => {
    it('should return array of staff', async () => {
      const result: any = 
      [
        {
          name: "Karim",
          email: "kerim@example.com",
          password: 'Kerim@123',
          phoneNumber: '9864000809',
          department: 'CE',
          attendance: 122,
          tokens : []
      },
      {
          name: "Rita",
          email: "rita@example.com",
          password: 'Rita@1234',
          phoneNumber: "3964009809",
          department: 'ME',
          attendance: 113,
          tokens : []
      }
      ]
      jest.spyOn(staffService, 'findAll').mockResolvedValue(result);

      expect(await staffController.getAllStaffs()).toBe(result);
    })

    describe('getStaffById', () => {
      it('should return a staff by ID', async () => {
        const result: any = {
          name:"John",
          email:"john@example.com",
          password:"John@1234",
          phoneNumber:"1234567890",
          department:"CE",
          attendance:120
        };

        jest.spyOn(staffService, 'findById').mockResolvedValue(result);
  
        expect(await staffController.getStaffById('654c92beaff73f84314a24a1')).toBe(result);
      });
    });
  
    describe('addStaff', () => {
      it('should create a new staff', async () => {
        const createStaffDto: CreateStaffDto = {
          name: "Maya",
          email: "maya@example.com",
          password: 'Maya@1234',
          phoneNumber: "8964009809",
          department: 'ME',
          attendance: 213,
          _id: "6549be3dc6d51a63cad00330",
          tokens: []
        };
        const result: any = {};
        jest.spyOn(staffService, 'createOne').mockResolvedValue(result);
  
        expect(await staffController.addStaff(createStaffDto)).toBe(result);
      });
    });
  
    describe('updateStaff', () => {
      it('should update a staff by ID', async () => {
        const updateStudentDto: UpdateStaffDto = {
          name: "Jaya",
          email: "jaya@example.com",
          _id: '6549be3dc6d51a63cad0033a',
          password: 'Jaya@1234',
          phoneNumber: '1234567890',
          department: 'CE',
          attendance: 90,
          tokens: []
        };
        const result: any = {};
        jest.spyOn(staffService, 'updateOne').mockResolvedValue(result);
  
        expect(await staffController.updateStaff(updateStudentDto, '6549be3dc6d51a63cad00330')).toBe(result);
      });
    });
  
    describe('deleteStaff', () => {
      it('should delete a student by ID', async () => {
        jest.spyOn(staffService, 'deleteOne').mockResolvedValue();
  
        expect(await staffController.deleteStaff('6549be3dc6d51a63cad00330')).toBeUndefined();
      });
    });


  })
});
