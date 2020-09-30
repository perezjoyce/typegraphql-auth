import { Min } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput {
    @Field()
    token: string;

    @Field()
    @Min(5)
    password: string;
}