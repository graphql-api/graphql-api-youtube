import { ResolverMap } from '../types'

export const resolvers: ResolverMap = {
  YoutubeChannelContentDetailsRelatedPlaylists: {
    async uploads(root, args, { dataSources }) {
      if (typeof root.uploads === 'string') {
        const playlists = await dataSources.youtube.listPlaylists({
          id: root.uploads
        })
        return (
          playlists.find((playList) => playList.id === root.uploads) ?? null
        )
      }
      return null
    }
  },
  Query: {
    async listChannels(root, args, { dataSources }) {
      const channels = await dataSources.youtube.listChannels()
      return channels
    }
  }
}
