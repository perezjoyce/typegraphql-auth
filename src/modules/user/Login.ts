import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import bcrypt from 'bcryptjs'

import { User } from '../../entity/User'
import { MyContext } from '../../types/MyContext'

@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return null
        }

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            return null
        }

        if (!user.confirmed) {
            throw new Error("Please confirm email")
        }

        //send back a cookie
        ctx.req.session!.userId = user.id //create a session in redis and persist it

        return user
    }
}

