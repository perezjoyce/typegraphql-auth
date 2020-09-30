import { Connection } from "typeorm";
import faker from 'faker';

import { testConn } from "../../../test-utils/testConn";
import { gCall } from "../../../test-utils/gCall";
import { redis } from "../../../redis";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
    conn = await testConn();
    if (redis.status == "end") {
        await redis.connect();
    }
});
afterAll(async () => {
    redis.disconnect();
    await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
    it("create user", async () => {
        const user = {
            firstName: faker.name.findName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        console.log("PASSWORD", user.password)
        console.log("EMAIL", user.email)


        const response = await gCall({
            source: registerMutation,
            variableValues: {
                data: user
            }
        })

        expect(response).toMatchObject({
            data: {
                register: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        })

        //check if user was saved in the db
        const dbUser = await User.findOne({ where: { email: user.email } })
        expect(dbUser).toBeDefined()
        expect(dbUser!.confirmed).toBeFalsy()
        expect(dbUser!.firstName).toBe(user.firstName)
    });
});