import { Db } from "mongodb";

export interface GraphQLContext {
  userInfo: UserInfo,
  db: Db | void | undefined
}

export interface UserInfo {
  userId: string,
}