import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

import { IsEmailAlreadyUsed } from "./isEmailAlreadyUsed"
import { PasswordInput } from "../../shared/PasswordInput";
import { OkMixin } from "../../shared/OkMixin";

@InputType()
export class RegisterInput extends OkMixin(PasswordInput) {
    @Field()
    @Length(1, 255, { message: "First should be at least 1 character." })
    firstName: string;

    @Field()
    @Length(1, 255)
    lastName: string;

    @Field()
    @IsEmail()
    @IsEmailAlreadyUsed({ message: "Email is already in use." })
    email: string;
}