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

const logoutMutation = `
{
    logout 
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

        //TO DO: access the context
        // const context = makeTestContext(user.id);
        // context.req.session.destroy = jest
        // .fn()
        // .mockImplementation((fn) => fn(false));
        // context.res.clearCookie = jest.fn();

        const response = await gCall({
            source: logoutMutation,
            userId: user.id
        });

        expect(response).toMatchObject({
            data: {
                logout: true
            }
        })
        expect(context.req.session.destroy).toHaveBeenCalled();
    });
});