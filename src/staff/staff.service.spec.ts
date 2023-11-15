import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { Staff } from './schemas/staff.schema';

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
        expect(result).toEqual(outputStaff);
      });
    })

    describe('createOne', () => {
      it('should create a new staff and return it', async () => {
        const mockStaff: Staff = await staffService.createOne({
          name : "Mike",
          email : "mike@example.com",
          password : "Mike@1234",
          phoneNumber : '1234567890',
          department : "CE",
          attendance : 120,
          tokens : []
      });

      mockStaffModel.create.mockResolvedValue(mockStaff);
      expect(mockStaff).toBeDefined();
      });
    });

    describe('updateOne', () => {
      it('should update an existing staff and return the updated data', async () => {
        const result : Staff = await staffService.updateOne('653365527f2490effb99f630', { 
          name : "Lina",
          email : "lina@example.com",
          password : "Lina@1234",
          phoneNumber : '1234567290',
          department : "CE",
          attendance : 120,
          tokens : []
         });
         mockStaffModel.findByIdAndUpdate.mockResolvedValue(result);
        expect(result).toBeDefined();
      });
    })

  describe('deleteOne', () => {
    it('should delete a staff and associated attendance data', async () => {
      const result = await staffService.deleteOne('653365527f2490effb99f630');
      mockStaffModel.findByIdAndDelete.mockResolvedValue(result)
      mockAttendanceModel.deleteMany.mockResolvedValue(result)
      expect(result).not.toBeDefined();
    });
  });

});
