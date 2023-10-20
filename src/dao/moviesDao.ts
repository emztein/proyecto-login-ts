import Movie from '../types/Movie';
import fs from 'fs';
import path from 'path';


export const getMovies = (): Movie[] => {
  const filePath = path.join(__dirname, '../data/Movies.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const movies: Movie[] = JSON.parse(data).Movies;
  return movies
}

export const getMovieById = (id: string) => {
  const movies: Movie[] = getMovies()
  return movies.find((movie: Movie) => movie.id === id)
}
