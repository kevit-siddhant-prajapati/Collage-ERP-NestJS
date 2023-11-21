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
import { UserHelper } from '../src/helper/user.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection : Connection;

  beforeAll(async () => {
  })

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
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

  describe('createAdmin', () => {
    it('Should signup a new admin', async () => {
      await request(app.getHttpServer()).post('/admin/new')
      .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
      .send({
          name : "Vira",
          email : "vira@admin.com",
          password : "Vira@1234"
      }).expect(201)

  })
})
  

describe('loginAdmin', () => {
  it('Should login existing Admin', async () => {
    const admin = adminStub()
      const response = await request(app.getHttpServer()).post('/auth/login').send({
          email : admin.email,
          password : admin.password,
          role : "Admin"
      }).expect(200)
  })
  
  it('Should not login nonexisting Admin', async () => {
    const admin = adminStub()
      await request(app.getHttpServer()).post('/auth/login').send({
          email : admin.email,
          password : '1234qwer',
          role : "Admin"
      }).expect(401)
  })
})
  
describe('getAllAdmin', () => {

  it('Not getting data of all admin to unauthorize person', () => {
    return request(app.getHttpServer())
      .get('/admin/all')
      .expect(401)
  });

  it('autherize user can see the all staff', async () => { 
      await request(app.getHttpServer())
      .get('/admin/all')
      .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
      .expect(200)
  })

})
describe('deleteAdmin', () => {
  it('should delete account for admin', async () => {
    const admin : any= adminStub()
      await request(app.getHttpServer()).delete(`/admin/delete/${admin._id}`)
      .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
      .send()
      .expect(204);
  })
  
  it('should not delete account for unauthenticated admin', async () => {
    const admin : any = adminStub()
      await request(app.getHttpServer()).delete(`/admin/delete/${admin._id}`).send().expect(401);
  })
})
  

describe('updateAdmin', () => {
  it('Should update valid admin fields', async () => {
    const admin:any = adminStub()
      await request(app.getHttpServer())
      .patch(`/admin/update/${admin._id}`)
      .set('Authorization', `Bearer ${admin.tokens[0].token}`)
      .send({
          name : "Riya",
      }).expect(200)
    })


  it('Should not update admin with unauthorize users', async () => {
      await request(app.getHttpServer())
     .patch(`/admin/update/${adminStub()._id}`)
     .send({
         location : "Rajkot"
     })
     .expect(401)
  })
})

})
