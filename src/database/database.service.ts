import { Injectable } from "@nestjs/common"
import { InjectConnection } from "@nestjs/mongoose"
import { Connection } from "mongoose"

@Injectable()
export class DatabaseService {
    constructor(@InjectConnection() private readonly connnection: Connection){}

    getDbHandle(): Connection {
        return this.connnection;
    }
}