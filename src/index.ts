import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { buildSchema } from 'type-graphql'
import { createConnection } from "typeorm"
import session from "express-session"
import connectRedis from 'connect-redis'
import cors from 'cors'

import { redis } from './redis'

const PORT = 4000

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [__dirname + "/modules/**/*.ts"],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId //returns a boolean
        }

    })

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }: any) => ({ req, res }) //access session data
    })

    const app = Express()

    const RedisStore = connectRedis(session);

    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3000"
        })
    )

    app.use(
        session({
            store: new RedisStore({
                client: redis as any
            }),
            name: "qid",
            secret: "aslkdfjoiq12312",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true, //so js can't access it
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
            }
        })
    )

    apolloServer.applyMiddleware({ app })

    app.listen(PORT, () => {
        console.log(`Server started at PORT ${PORT}/graphql.`)
    })
}

main()