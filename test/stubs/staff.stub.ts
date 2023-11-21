
import { ObjectId } from "bson";

export const staffStub = ()  => {
    return  {
        _id : new ObjectId("6556eb0e3e72dd881bac84fb"),
        name : 'John',
        email: 'john@example.com',
        password : 'John@1234',
        phoneNumber : '1234567890',
        department : 'CE',
        attendance : 120,
        tokens : [{
            //token : jwt.sign({_id : new ObjectId("6556eb0e3e72dd881bac84fb")}, process.env.JWT_SECRET_CODE)
            token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTU2ZWIwZTNlNzJkZDg4MWJhYzg0ZmIiLCJpYXQiOjE3MDA1NDExMjh9.gVSmmvL5xarH4e0uVvmRCEKDS0NZeTAsieosOfEpd2g'
        }]
    }
}