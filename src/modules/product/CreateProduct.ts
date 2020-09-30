import { Resolver } from "type-graphql";
import { Product } from "../../entity/Product";
import { createResolver } from "../shared/CreateResolver";
import { ProductInput } from "./ProductInput";

const BaseCreateProduct = createResolver(
    "Product",
    Product,
    ProductInput,
    Product
)

@Resolver()
export class CreateProductResolver extends BaseCreateProduct { }
