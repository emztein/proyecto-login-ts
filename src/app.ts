import express from 'express';
import { connectToDatabase } from './database/database';
import { ApolloServer } from 'apollo-server-express'
import authRoutes from './routes/authRoutes';
import { typeDefs } from './graphql/schema';
import resolvers from './graphql/resolvers';
import jwt from 'jsonwebtoken'
import { CONFIG } from './helpers/config';
import { Db } from 'mongodb';
import { GraphQLContext, UserInfo } from './types/GraphQl';

async function startApolloServer(db: Db | void | undefined) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const obj: GraphQLContext = {
        db,
        userInfo: jwt.verify(token, CONFIG.JWT ?? '') as UserInfo
      }
      return obj;
    }
  });

  await server.start();
  const app = express();
  app.use(express.json());
  app.use(authRoutes);
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(3001, () => {
    console.log('Express server running on port 3001...');
  });

}

const main = async () => {
  const db = await connectToDatabase().catch(e => console.error("error connecting to db"))
  await startApolloServer(db)
}

main()