import { YoutubeDataSource } from './dataSource'
export { resolvers } from './resolvers'
export { typeDefs } from './typeDefs'

export const dataSourceParams: ConstructorParameters<
  typeof YoutubeDataSource
>[0] = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
}

export { YoutubeDataSource }
