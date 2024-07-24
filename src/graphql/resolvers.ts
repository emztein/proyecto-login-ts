import { getUsers } from '../dao/authDao';
import { getMovies } from '../dao/moviesDao';
import Movie from '../types/Movie';
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../controller/authController';
import { GraphQLContext } from '../types/GraphQl';

const resolvers = {
  Query: {
    getUserLikedMovies: combineResolvers(isAuthenticated, async (_: any, __: any, context: GraphQLContext) => {

      try {
        const users = await getUsers();
        const movies = getMovies();
        const user = users.find((user) => user.id === context.userInfo.userId);
        if (!user) {
          throw new Error('User not found');
        }

        let result: Movie[];

        result = movies.filter((movie: Movie) => user.likedMovies.includes(movie.id));
        return result
      } catch (error) {
        throw new Error('Invalid or expired token');
      }
    }),
  },
};

export default resolvers;
