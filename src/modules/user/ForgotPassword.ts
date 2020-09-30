import { User } from '../../entity/User';
import { sendEmail } from '../../utils/sendEmail'
import { createConfirmationUrl } from '../../utils/createConfirmationUrl'
import { Resolver, Mutation, Arg } from 'type-graphql'


@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
    ): Promise<boolean> {
        const user = await User.findOne({ where: { email } })

        await sendEmail(
            email,
            await createConfirmationUrl(user!.id),
            `${user!.firstName} ${user!.lastName}`,
            "Click to change your password"
        )

        return true
    }
} 
