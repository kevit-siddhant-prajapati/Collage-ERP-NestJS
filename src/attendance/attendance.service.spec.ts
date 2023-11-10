import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AttendanceService } from './attendance.service';
import { fillAttendanceDto } from './dto/fill-Attendance.dto';
import { ManageAttendanceDto } from './dto/manage-attendance.dto';
import { ObjectId } from 'bson';
import { Attendance } from './schemas/attendance.schema';

const mockAttendanceModel = {
  findById : jest.fn(),
  create : jest.fn(),
  findByIdAndUpdate : jest.fn(),
  find : jest.fn()
};

const mockStudentModel = {
  findById : jest.fn()
}

const mockStaffModel = {
  findById : jest.fn()
}


describe('AttendanceService', () => {
  let attendanceService: AttendanceService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
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
          provide: 'AttendanceModel',
          useValue: mockAttendanceModel,
        },
      ],
    }).compile();

    attendanceService = moduleRef.get<AttendanceService>(AttendanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fillStudentAttendance', () => {
    it('should return an message attendance fill', async () => {
      const fillMockAttendance : fillAttendanceDto = {
        date: new Date('2020-06-22'),
        attendance: [
          "653368ad805360f92d8cb999",
          "65336973805360f92d8cb9b9"
        ],
        role: 'Student'
      } 
      mockAttendanceModel.find.mockResolvedValue(fillMockAttendance);
      const result = await attendanceService.fillStudentAttendance(fillMockAttendance);
      expect(result).toEqual("attendance of Student Filled Successfully"); 
    });

  });

  describe('fillStaffAttendance', () => {
    it('should return an message attendance fill', async () => {
      const fillMockAttendance : fillAttendanceDto = {
        date: new Date('2020-06-22'),
        attendance: [
          "653368ad805360f92d8cb99a",
          "65336973805360f92d8cb9bb"
        ],
        role: 'Staff'
      } 
      mockAttendanceModel.find.mockResolvedValue(fillMockAttendance);
      const result = await attendanceService.fillStaffAttendance(fillMockAttendance);
      expect(result).toEqual("attendance of Staff Filled Successfully"); 
    });

  });


  describe('manageAttendanceById', () => {
    it('can update the available attendance', async () => {
      const result : Attendance = await attendanceService.manageAttendanceById({
        date : new Date('2020-06-22'),
        status : false,
        roleOfUser : 'Student',
        userId : new ObjectId("653368ad805360f92d8cb99a")
      }, '65336973805360f92d8cb9bb'); 
      mockAttendanceModel.findByIdAndUpdate.mockResolvedValue(result)
      expect(result).toBeDefined();
    })
  })

  describe('getAttendanceByRole', () => {
    it('get data of user by its role', async () => {
      const attendaceData : Attendance[] = await attendanceService.getAttendanceByRole({
        date: undefined,
        status: false,
        roleOfUser: 'Student',
        userId: new ObjectId
      })
      mockAttendanceModel.find.mockResolvedValue(attendaceData)
      expect(attendaceData).toBeDefined()
    })
  })


  

});
