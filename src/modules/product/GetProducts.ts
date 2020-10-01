import { Resolver } from "type-graphql";
import { Product } from "../../entity/Product";
import { isAuth } from "../../middleware/isAuth";
import { getResolver } from "../shared/GetResolver";

const BaseGetProducts = getResolver(
    "Products",
    Product,
    Product,
    [isAuth as any]
)

@Resolver()
export class GetProductsResolver extends BaseGetProducts { }
