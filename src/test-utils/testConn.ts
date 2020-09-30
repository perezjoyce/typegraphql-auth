import { createConnection } from "typeorm";

//create a test connection to the db
//write setup.ts file and then add db:setup and test scripts in package.json
//run createdb test-2 to create db
export const testConn = (drop: boolean = false) => {
    return createConnection({
        name: "default",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "test",
        password: "test",
        database: "test-2", //dev db is called test
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + "/../entity/*.*"]
    });
};