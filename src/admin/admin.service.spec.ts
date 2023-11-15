import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';

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
      it('should create a new admin and return it', async () => {
        const mockAdmin: Admin = await adminService.createOne({
          name : "Mike",
          email : "mike@example.com",
          password : "Mike@1234",
          tokens : []
      });

      mockAdminModel.create.mockResolvedValue(mockAdmin);
      expect(mockAdmin).toBeDefined();
      });
    });

    describe('updateOne', () => {
      it('should update an existing admin and return the updated data', async () => {
        const result : Admin = await adminService.updateOne('653365527f2490effb99f630', { 
          name : "Lina",
          email : "lina@example.com",
          password : "Lina@1234",
          tokens : []
         });
         mockAdminModel.findByIdAndUpdate.mockResolvedValue(result);
        expect(result).toBeDefined();
      });
    })

  describe('deleteOne', () => {
    it('should delete a admin and associated attendance data', async () => {
      const result = await adminService.deleteOne('653365527f2490effb99f630');
      console.log(result)
      mockAdminModel.findByIdAndDelete.mockResolvedValue(result)
      expect(result).toBeDefined();
    });
  });

});
