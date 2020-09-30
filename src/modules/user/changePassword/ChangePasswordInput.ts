import { Field, InputType } from "type-graphql";
import { OkMixin } from "../../shared/OkMixin";
import { PasswordInput } from "../../shared/PasswordInput";

@InputType()
export class ChangePasswordInput extends OkMixin(PasswordInput) {
    @Field()
    token: string;
}