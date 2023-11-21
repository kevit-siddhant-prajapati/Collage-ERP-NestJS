
import { ObjectId } from "bson";

export const adminStub = ()  => {
    return  {
        _id : new ObjectId("6556eb0e3e72dd881bac8501"),
        name : 'Sara',
        email: 'sara@admin.com',
        password : 'Sara@1234',
        tokens : [{
            //token : jwt.sign({_id : new ObjectId("6556eb0e3e72dd881bac8501")}, process.env.JWT_SECRET_CODE)
            token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTU2ZWIwZTNlNzJkZDg4MWJhYzg1MDEiLCJpYXQiOjE3MDA1NDExMjh9.kZZrju9sWEuk217k35ExhqgD77nVQccOjokv_1GKtM8'
        }]
    }
}