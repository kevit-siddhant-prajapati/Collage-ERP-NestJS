import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { UserHelper } from '../helper/user.helper';

const mockAdminModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
};


describe('AdminService', () => {
  let adminService: AdminService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        JwtService,
        {
          provide: 'AdminModel',
          useValue: mockAdminModel,
        },
      ],
    }).compile();

    adminService = moduleRef.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of secure admins', async () => {
      const mockAdmins : Admin[] = [
        {
          name: 'Kevin',
          email: 'kevin@example.com',
          password: 'Kevin@123',
          tokens: [],
        },
        {
          name: 'Maya',
          email: 'maya@example.com',
          password: 'Maya@1234',
          tokens: [],
        },
      ];
      const outputAdmin = [
        {
          name: 'Kevin',
          email: 'kevin@example.com',
        },
        {
          name: 'Maya',
          email: 'maya@example.com',
        },
      ];
      mockAdminModel.find.mockResolvedValue(mockAdmins);
      const result = await adminService.findAll();
      expect(result).toEqual(outputAdmin); 
    });

  });


  describe('findById', () => {
      it('should return a single staff by Id', async () => {
        const mockAdmin: Admin = {
          name: "Kevin",
          email: "kevin@example.com",
          password: 'Kevin@123',
          tokens : []
      };
        mockAdminModel.findById.mockResolvedValue(mockAdmin);
        const result = await adminService.findById('653365527f2450effb99f630');
        expect(result).toEqual(mockAdmin);
      });
    })

    describe('createOne', () => {
      it('should create a new admin', async () => {
        const adminData = {
          name : "Lina",
          email : "lina@example.com",
          password : "Lina@1234",
          tokens : []
        };
  
        const hashedPasswordAdmin = '$2b$08$36sq1MNRqpERM8IejEv9Be9qsNy9UtmqGr5ObMDTkBhb5VoldTtJW'; // replace with actual hashed password

        jest.spyOn(UserHelper, 'convertToHash').mockResolvedValue(hashedPasswordAdmin);
  
        const mockGenerateAuthToken = jest.spyOn(UserHelper, 'generateAuthToken').mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTQ5YmVkY2M2ZDUxYTYzY2FkMDAzNGYiLCJpYXQiOjE3MDAxMjA0NDgsImV4cCI6MTcwMDEyNDA0OH0.dGd_YBQbCG69lgMVnf-qXxk3yN_Y8hHr35uPwb6vclw');
        
        mockAdminModel.create.mockResolvedValue(adminData);
  
        const result = await adminService.createOne(adminData);

        expect(result).toEqual(adminData);
        expect(mockGenerateAuthToken).toHaveBeenCalled();
    });
  })

    describe('updateOne', () => {
      it('should update an existing staff and return the updated data', async () => {
        const mockAdmin = { 
          //value that to be update
          name : "Mike",
          email : "mike@example.com",
          password : "Mike@1234",
          _id : '653365527f2490effb99f630',
          tokens : []
         };

        const hashedPasswordAdmin = '$2b$08$36sq1MNRqpERM8IejEv9Be9qsNy9UtmqGr5ObMDTkBhb5VoldTtJW'; // replace with actual hashed password

        jest.spyOn(UserHelper, 'convertToHash').mockResolvedValue(hashedPasswordAdmin);
        
        mockAdminModel.findByIdAndUpdate.mockResolvedValue(mockAdmin)

        const result = await adminService.updateOne('653365527f2490effb99f630', {
          //original value(in mock-data)
          name: 'Linda',
          email: 'linda',
          password: 'Linda@123',
          tokens: []
        })

        expect(result).toEqual(mockAdmin);
      });
    })

  describe('deleteOne', () => {
    it('should delete a admin and associated attendance data', async () => {
      const mockAdmin = { 
        name : "Mike",
        email : "mike@example.com",
        password : "Mike@1234",
        _id : '653365527f2490effb99f630', 
        tokens : []
       };
      mockAdminModel.findByIdAndDelete.mockResolvedValue(mockAdmin)
      const result = await adminService.deleteOne('653365527f2490effb99f630');
      expect(result).toBeDefined();
    });
  });

});
