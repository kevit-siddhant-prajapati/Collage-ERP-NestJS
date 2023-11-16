import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'bson';
import { AuthService } from './auth.service';


const mockStudentModel = {
  findOne : jest.fn(),
  updateMany : jest.fn()
}

const mockStaffModel = {
  findOne : jest.fn(),
  updateMany : jest.fn()
}

const mockAdminModel = {
  findOne : jest.fn(),
  updateMany : jest.fn()
}


describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: 'StudentModel',
          useValue: mockStudentModel,
        },
        {
          provide: 'StaffModel',
          useValue: mockStaffModel,
        },
        {
          provide: 'AdminModel',
          useValue: mockAdminModel,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginStudent', () => {
    it('give authorization to authenticated student', async () => {
      const studentAuth = {
        email : "sidd@admin.com",
        password: "Sidd@1234",
        role : "Student"
      }
      mockStudentModel.findOne.mockResolvedValue(studentAuth)
      const result = await authService.loginStudent(studentAuth)
      expect(studentAuth).toEqual(result)
    })
  })

  describe('loginStaff', () => {
    it('give authorization to authenticated staff', async () => {
      const staffAuth = {
        email : "ram@admin.com",
        password: "Ram@12345",
        role : "Staff"
      }
      mockStaffModel.findOne.mockResolvedValue(staffAuth)
      const result = await authService.loginStaff(staffAuth)
      expect(staffAuth).toBe(result)
    })
  })

  describe('loginAdmin', () => {
    it('give authorization to authenticated person', async () => {
      const adminAuth = {
        email : "sita@admin.com",
        password: "Sita@1234",
        role : "Admin"
      }
      mockAdminModel.findOne.mockResolvedValue(adminAuth)
      const result = await authService.loginAdmin(adminAuth)
      expect(adminAuth).toBe(result)
    })
  })

  describe('logout', () => {
    it('should logout all users by updating tokens to an empty array', async () => {
      await authService.logout();
      expect(mockStudentModel.updateMany).toHaveBeenCalledWith({}, { $set: { tokens: [] } });
      expect(mockStaffModel.updateMany).toHaveBeenCalledWith({}, { $set: { tokens: [] } });
      expect(mockAdminModel.updateMany).toHaveBeenCalledWith({}, { $set: { tokens: [] } });
    });
  })

});
