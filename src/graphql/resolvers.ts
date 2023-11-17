import { getUsers } from '../dao/authDao';
import { getMovies } from '../dao/moviesDao';
import Movie from '../types/Movie';
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../controller/authController';

const resolvers = {
  Query: {
    getUserLikedMovies: combineResolvers(isAuthenticated, (_: any, __: any, context: any) => {
      try {
        const users = getUsers();
        const movies = getMovies();
        const user = users.find((user) => user.id === context.userId);
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
