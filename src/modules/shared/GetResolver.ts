import { ClassType, Query, Resolver, UseMiddleware } from "type-graphql";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

export function getResolver<T extends ClassType>(
    suffix: string,
    returnType: T,
    entity: any,
    middleware?: Middleware<any>[]
) {
    @Resolver({ isAbstract: true })
    class BaseResolver {
        @Query(() => [returnType], { name: `get${suffix}` })
        @UseMiddleware(...(middleware || []))
        async get() {
            return entity.find();
        }
    }

    return BaseResolver;
}