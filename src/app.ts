import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import authRoutes from './routes/authRoutes';
import { typeDefs } from './graphql/schema';
import resolvers from './graphql/resolvers';

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
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
  console.log('GraphQL server running at http://localhost:3001/graphql');
}

startApolloServer().catch((error) => {
  console.error('Error starting Apollo server:', error)
});
