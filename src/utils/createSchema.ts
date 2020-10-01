import { buildSchema } from "type-graphql";
import { CreateProductResolver } from "../modules/product/CreateProduct";
import { GetProductsResolver } from "../modules/product/GetProducts";
import { ChangePasswordResolver } from "../modules/user/ChangePassword";
import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/Login";
import { LogoutResolver } from "../modules/user/Logout";
import { MeResolver } from "../modules/user/Me";
import { RegisterResolver } from "../modules/user/Register";

export const createSchema = () =>
    buildSchema({
        resolvers: [
            ChangePasswordResolver,
            ConfirmUserResolver,
            ForgotPasswordResolver,
            LoginResolver,
            LogoutResolver,
            MeResolver,
            RegisterResolver,
            CreateProductResolver,
            GetProductsResolver
        ],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        }
    });