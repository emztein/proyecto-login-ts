import express from 'express';
import { connectToDatabase } from './database/database';
import { ApolloServer } from 'apollo-server-express'
import authRoutes from './routes/authRoutes';
import { typeDefs } from './graphql/schema';
import resolvers from './graphql/resolvers';
import jwt from 'jsonwebtoken'
import { CONFIG } from './helpers/config';

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return jwt.verify(token, CONFIG.JWT ?? '');
    }
  });

  const startDB = async () => {
    await connectToDatabase()
    const port = CONFIG.PORT;
    app.listen(port, () => {
      console.log(`Servidor de base de datos corriendo en http://localhost:${port}`);
    });
  }

  await server.start();
  const app = express();
  app.use(express.json());
  app.use(authRoutes);
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(3001, () => {
    console.log('Express server running on port 3001...');
  });
  console.log('GraphQL server running at http://localhost:3001/graphql');

  await startDB().catch(error => console.error(error))
}

startApolloServer().catch((error) => {
  console.error('Error starting Apollo server:', error)
});
