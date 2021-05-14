import { ResolverMap } from '../types'

export const resolvers: ResolverMap = {
  YoutubePlaylistItem: {
    async video(root, args, { dataSources }) {
      const videoId =
        root.contentDetails?.videoId || root.snippet.resourceId.videoId
      if (videoId) {
        const videos = await dataSources.youtube.listVideos({
          id: root.contentDetails.videoId
        })
        return videos.find((video) => video.id === videoId) ?? null
      }
      return null
    }
  },
  YoutubePlaylist: {
    async items(root, args, { dataSources }) {
      if (typeof root.id === 'string') {
        const playlistItems = await dataSources.youtube.listPlaylistItems({
          playlistId: root.id
        })
        return playlistItems
      }
      return null
    }
  },
  Query: {
    async listPlaylists(root, args, { dataSources }, info) {
      const playlists = await dataSources.youtube.listPlaylists(args)
      return playlists
    },
    async listPlaylistItems(root, args, { dataSources }) {
      const playlistItems = await dataSources.youtube.listPlaylistItems(args)
      return playlistItems
    }
  }
}
