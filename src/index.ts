import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express'
import * as Express from 'express'
import { buildSchema, Resolver, Query } from 'type-graphql'
import { createConnection } from "typeorm";
const PORT = 4000;

@Resolver()
class HelloResolver {
    @Query(() => String, { name: "helloWorld", nullable: true, description: "sample description" })
    async hello() {
        return "Hello, World!"
    }
}

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [HelloResolver],
    })

    const apolloServer = new ApolloServer({ schema })

    const app = Express()

    apolloServer.applyMiddleware({ app })

    app.listen(PORT, () => {
        console.log(`Server started at PORT ${PORT}/graphql.`)
    })
}

main()