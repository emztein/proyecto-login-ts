import { getUsers } from '../dao/authDao';
import { getMovies } from '../dao/moviesDao';
import Movie from '../types/Movie';

const resolvers = {
  Query: {
    getUserLikedMovies: (_: any, args: { userId: string }) => {
      const users = getUsers();
      const movies = getMovies();

      const user = users.find((user) => user.id === args.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const result = movies.filter((movie: Movie) => user.likedMovies.includes(movie.id));
      return result
    },
  },
};

export default resolvers;
