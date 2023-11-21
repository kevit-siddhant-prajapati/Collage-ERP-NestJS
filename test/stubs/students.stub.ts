import { ObjectId } from "bson";

export const studentStub = ()  => {
    const studentOne = {
        _id : new ObjectId("654c90d94d320ee33c106517"),
        name : 'Mike',
        email: 'mike@example.com',
        password : 'Mike@1234',
        phoneNumber : '1234567890',
        department : 'CE',
        batch : 2020,
        currentSem : 1,
        attendance : 120,
        tokens : [{
            token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRjOTBkOTRkMzIwZWUzM2MxMDY1MTciLCJpYXQiOjE3MDA1NDA5NzF9.NbmvDzPYwdQYW_IahlnHAUKAcsBP9vbRYAyb8LKGvHQ'
        }]
        }
    return studentOne
}