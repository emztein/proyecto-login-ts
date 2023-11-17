import { gql } from 'apollo-server';

export const typeDefs = gql`
type Movie {
  id: ID!
  title:String!
  genre:String!
}

type User {
  id: ID!
  username: String!
  likedMovies: [Movie!]!
}

type Query{
  getUserLikedMovies:[Movie!]!
}
`;