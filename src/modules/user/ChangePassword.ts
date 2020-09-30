import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import bcrypt from 'bcryptjs'

import { User } from '../../entity/User';
import { forgotPasswordPrefix } from '../../constants/redisPrefixes';
import { ChangePasswordInput } from '../user/changePassword/ChangePasswordInput';
import { redis } from '../../redis'
import { MyContext } from '../../types/MyContext';


@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("data")
        { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext //to automatically login user
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token)

        console.log("==========USERID==========", userId)

        if (!userId) {
            return null
        }

        const user = await User.findOne(userId)

        if (!user) {
            return null
        }

        await redis.del(forgotPasswordPrefix + token)

        user.password = await bcrypt.hash(password, 12)
        await user.save()
        ctx.req.session!.userId = user.id; //automatically login user


        return user
    }
} 
