import { Connection } from "typeorm";
import faker from 'faker';
import bcrypt from 'bcryptjs'

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
    await conn.close();
    redis.disconnect();
});

const meQuery = `
{
    me {
      id
      name
      firstName
      lastName
      email
    }
  }
`;

describe("Me", () => {
    it("get user", async () => {
        const password = faker.internet.password()
        const hashedPassword = await bcrypt.hash(password, 12)
        console.log("UNHASHED PASSWORD", password)

        const user = await User.create({
            firstName: faker.name.findName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: hashedPassword
        }).save()

        const response = await gCall({
            source: meQuery,
            userId: user.id
        });

        expect(response).toMatchObject({
            data: {
                me: {
                    id: `${user.id}`,
                    name: `${user.firstName} ${user.lastName}`,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        })
    });

    it("return null", async () => {
        const response = await gCall({
            source: meQuery
        })

        expect(response).toMatchObject({
            data: {
                me: null
            }
        })
    });
});