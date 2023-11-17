import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose, { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '../src/database/database.service';
import { studentStub } from './stubs/students.stub';
import { staffStub } from './stubs/staff.stub';
import { adminStub } from './stubs/admin.stub';
import { staffAttendanceStub } from './stubs/staff-attendance.stub';
import { studentAttendanceStub } from './stubs/student-attendance.stub';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection : Connection;

  beforeAll(async () => {
  })

  afterAll(async () => { 
    await dbConnection.collection('students').deleteMany({});
    await dbConnection.collection('staffs').deleteMany({});
    await dbConnection.collection('admins').deleteMany({});
    await dbConnection.collection('attendances').deleteMany({});
    await dbConnection.collection('students').insertOne(studentStub())
    await dbConnection.collection('attendances').insertOne(studentAttendanceStub())
    await dbConnection.collection('staffs').insertOne(staffStub())
    await dbConnection.collection('attendances').insertOne(staffAttendanceStub())
    await dbConnection.collection('admins').insertOne(adminStub())
    await app.close()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: './.test.env',
          isGlobal : true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
  });

  
  describe('getAllStaff', () => {

    it('Not getting data of all staff to unauthorize person', () => {
      return request(app.getHttpServer())
        .get('/staffs/all')
        .expect(401)
    });

    it('autherize user can see the all staff', async () => { 
        const response = await request(app.getHttpServer())
        .get('/staffs/all')
        .set('Authorization', `Bearer ${staffStub().tokens[0].token}`)
        expect(response.status).toBe(200)
    })
  
  })


  describe('createStaff', () => {
    it('unauthorize user should not create a new staff', async () => {
      return request(app.getHttpServer()).post('/staffs/new')
      .send({
          name : 'Aman',
          email :'aman@example.com',
          password : 'Aman@1234',
          phoneNumber : 2134567890,
          department : 'CE',
      }).expect(401)
    })

    it('authorize user should create a new staff', async () => {
      const admin = adminStub()
      const result = await request(app.getHttpServer()).post('/staffs/new')
      .set('Authorization', `Bearer ${admin.tokens[0].token}`)
      .send({
          name : 'Aman',
          email :'aman@example.com',
          password : 'Aman@1234',
          phoneNumber : "2134567890",
          department : 'CE',
          attendance : 100
      }).expect(201)
    })
  })


  describe('createStaff', () => {
    it('Should login existing Staff', async () => {
      const staff = staffStub()
      return request(app.getHttpServer()).post('/auth/login').send({
          email : staff.email,
          password : staff.password,
          role : "Staff"
      }).expect(200)
    })

    it('Should not login existing Staff', async () => {
      const staff = staffStub()
      const result = await request(app.getHttpServer()).post('/auth/login').send({
          email : staff.email,
          password : '12abc1234',
          role : "Staff"
      }).expect(401)

    })
  })


  describe('deleteStaff', () => {
    it('should delete account for staff', async () => {
      const staff: any = staffStub()
      return request(app.getHttpServer()).delete(`/staffs/delete/${staff._id}`)
      .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
      .send()
      .expect(204);
    })

    it('should not delete account for unauthenticated staff', async () => {
      const staff : any = staffStub()
      return request(app.getHttpServer()).delete(`/staffs/delete/${staff._id}`).send().expect(401);
    })
  })


  describe('updateStaff', () => {
    it('Should update valid staff fields', async () => {
      const staff: any = staffStub()
      const result = await request(app.getHttpServer())
      .patch(`/staffs/update/${staff._id}`)
      .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
      .send({
          name : "siddhant",
      })
      .expect(200)
    })

    it('Should not update staff with unauthorize users', async () => {
      const staff : any = staffStub()
      return request(app.getHttpServer())
    .patch(`/staffs/update/${staff._id}`)
    .send({
        location : "Rajkot"
    })
    .expect(401)
    })
  })
  
  })






