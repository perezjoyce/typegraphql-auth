import { Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from '../../types/MyContext'

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext): Promise<Boolean> {

        //return a promise because destroy method doesn't return anything
        return new Promise((res, rej) => {
            //destroys session, not the cookie for the user
            ctx.req.session!.destroy((error) => {
                if (error) {
                    console.log(error)
                    rej(false)
                }

                res(true)
            })
        })
    }
}