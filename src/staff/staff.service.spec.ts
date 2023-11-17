import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { Staff } from './schemas/staff.schema';
import { UserHelper } from '../helper/user.helper';

const mockStaffModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockAttendanceModel = {
  deleteMany: jest.fn(),
};

describe('StaffService', () => {
  let staffService: StaffService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: 'AttendanceModel',
          useValue: mockAttendanceModel,
        },
        {
          provide: 'StaffModel',
          useValue: mockStaffModel,
        },
      ],
    }).compile();

    staffService = moduleRef.get<StaffService>(StaffService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of secure staffs', async () => {
      const mockStaffs : Staff[] = [
        {
          name: 'Kevin',
          email: 'kevin@example.com',
          password: 'Kevin@123',
          phoneNumber: '8864000809',
          department: 'CE',
          attendance: 216,
          tokens: [],
        },
        {
          name: 'Maya',
          email: 'maya@example.com',
          password: 'Maya@1234',
          phoneNumber: '8964009809',
          department: 'ME',
          attendance: 213,
          tokens: [],
        },
      ];
      const outputStaff = [
        {
          name: 'Kevin',
          email: 'kevin@example.com',
          phoneNumber: '8864000809',
          department: 'CE',
          attendance: 216,
        },
        {
          name: 'Maya',
          email: 'maya@example.com',
          phoneNumber: '8964009809',
          department: 'ME',
          attendance: 213,
        },
      ]
      mockStaffModel.find.mockResolvedValue(mockStaffs);
      const result = await staffService.findAll();
      result.forEach(staff => {
        delete staff.password
        delete staff.tokens
      })
      expect(result).toEqual(outputStaff); 
    });

  });


  describe('findById', () => {
      it('should return a single staff by Id', async () => {
        const mockStaff: Staff = {
          name: "Kevin",
          email: "kevin@example.com",
          password: 'Kevin@123',
          phoneNumber: '8864000809',
          department: 'CE',
          attendance: 216,
          tokens : []
      };
      const outputStaff = {
        name: "Kevin",
          email: "kevin@example.com",
          phoneNumber: '8864000809',
          department: 'CE',
          attendance: 216,
      }
        mockStaffModel.findById.mockResolvedValue(mockStaff);
        const result = await staffService.findById('653365527f2450effb99f630');
        delete result.password
        delete result.tokens
        expect(result).toEqual(outputStaff);
      });
    })

    describe('createOne', () => {
      it('should create a new student', async () => {
        const staffData = {
          name : "Lina",
          email : "lina@example.com",
          password : "Lina@1234",
          phoneNumber : '1234567290',
          department : "CE",
          attendance : 120,
          tokens : []
        };
  
        const hashedPasswordStaff = '$2b$08$36sq1MNRqpERM8IejEv9Be9qsNy9UtmqGr5ObMDTkBhb5VoldTtJW'; // replace with actual hashed password

        jest.spyOn(UserHelper, 'convertToHash').mockResolvedValue(hashedPasswordStaff);
  
        const mockGenerateAuthToken = jest.spyOn(UserHelper, 'generateAuthToken').mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTQ5YmVkY2M2ZDUxYTYzY2FkMDAzNGYiLCJpYXQiOjE3MDAxMjA0NDgsImV4cCI6MTcwMDEyNDA0OH0.dGd_YBQbCG69lgMVnf-qXxk3yN_Y8hHr35uPwb6vclw');
        
        mockStaffModel.create.mockResolvedValue(staffData);
  
        const result = await staffService.createOne(staffData);

        expect(result).toEqual(staffData);
        expect(mockGenerateAuthToken).toHaveBeenCalled();
    });
  })

    describe('updateOne', () => {
      it('should update an existing student and return the updated data', async () => {
        const mockStaff = { 
          //value that to be update
          name : "Mike",
          email : "mike@example.com",
          password : "Mike@1234",
          phoneNumber : '1234567290',
          department : "CE",
          attendance : 120,
          _id : '653365527f2490effb99f630',
          tokens : []
         };

        const hashedPasswordStaff = '$2b$08$36sq1MNRqpERM8IejEv9Be9qsNy9UtmqGr5ObMDTkBhb5VoldTtJW'; // replace with actual hashed password

        jest.spyOn(UserHelper, 'convertToHash').mockResolvedValue(hashedPasswordStaff);
        
        mockStaffModel.findByIdAndUpdate.mockResolvedValue(mockStaff)

        const result = await staffService.updateOne('653365527f2490effb99f630', {
          //original value(in mock-data)
          attendance: 100,
          name: 'Linda',
          email: 'linda',
          password: 'Linda@123',
          phoneNumber: '9087654321',
          department: 'EC',
          tokens: []
        })

        expect(result).toEqual(mockStaff);
      });
    })

  describe('deleteOne', () => {
    it('should delete a student and associated attendance data', async () => {
      const mockStaff = { 
        name : "Mike",
        email : "mike@example.com",
        password : "Mike@1234",
        phoneNumber : '1234567290',
        department : "CE",
        attendance : 120,
        _id : '653365527f2490effb99f630', 
        tokens : []
       };
      mockStaffModel.findByIdAndDelete.mockResolvedValue(mockStaff)
      const result = await staffService.deleteOne('653365527f2490effb99f630');
      expect(result).not.toBeDefined();
    });
  });

});
