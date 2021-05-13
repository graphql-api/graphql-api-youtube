import { DateTimeResolver, URLResolver } from 'graphql-scalars'
import { ResolverMap } from '../types'

export const resolvers: ResolverMap = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  Query: {
    async channel() {
      return { name: 'test' }
    },
    async listChannels(root, args, { dataSources }) {
      const channels = await dataSources.youtube.listChannels()
      return channels
    }
  }
}
