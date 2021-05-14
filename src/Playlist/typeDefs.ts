import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type YoutubePlaylistSnippetLocalized {
    title: String
    description: String
  }

  type YoutubePlaylistSnippet {
    publishedAt: DateTime
    channelId: String
    channelTitle: String
    defaultLanguage: String
    localized: YoutubePlaylistSnippetLocalized
    title: String
    description: String
    thumbnails: YoutubeVideoThumbnails
  }

  type YoutubePlaylist {
    id: ID!
    etag: String
    kind: String
    snippet: YoutubePlaylistSnippet
    items: [YoutubePlaylistItem]
  }

  type YoutubePlaylistItemSnippetResoureceId {
    kind: String
    videoId: String
  }

  type YoutubePlaylistItemSnippet {
    publishedAt: DateTime
    channelId: String
    channelTitle: String
    title: String
    description: String
    thumbnails: YoutubeVideoThumbnails
    videoOwnerChannelId: String
    videoOwnerChannelTitle: String
    playlistId: String
    position: Int
    resourseId: YoutubePlaylistItemSnippetResoureceId
  }

  type YoutubePlaylistItemContentDetails {
    videoId: String
    startAt: String
    endAt: String
    note: String
    videoPublishedAt: DateTime
  }

  type YoutubePlaylistItem {
    id: ID!
    kind: String
    etag: String
    snippet: YoutubePlaylistItemSnippet
    contentDetails: YoutubePlaylistItemContentDetails
    status: PrivacyStatus
    video: YoutubeVideo
  }

  extend type Query {
    listPlaylists: [YoutubePlaylist]
    listPlaylistItems: [YoutubePlaylistItem]
  }
`
