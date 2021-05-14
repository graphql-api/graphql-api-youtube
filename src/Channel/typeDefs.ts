import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type YoutubeChannelSnippet {
    title: String
    description: String
    customUrl: String
    publishedAt: DateTime
    country: String
  }

  type YoutubeChannelContentDetailsRelatedPlaylists {
    likes: YoutubePlaylist
    favorites: YoutubePlaylist
    uploads: YoutubePlaylist
  }

  type YoutubeChannelContentDetails {
    relatedPlaylists: YoutubeChannelContentDetailsRelatedPlaylists
  }

  type YoutubeChannel {
    kind: String
    etag: String
    id: ID!
    snippet: YoutubeChannelSnippet
    contentDetails: YoutubeChannelContentDetails
  }

  extend type Query {
    listChannels(input: ListChannelInput): [YoutubeChannel]
  }

  input ListChannelInput {
    forUsername: String
    """
    The id parameter specifies a comma-separated list of the YouTube channel ID(s) for the resource(s) that are being retrieved. In a channel resource, the id property specifies the channel's YouTube channel ID.
    """
    id: String
    """
    This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.
    """
    managedByMe: Boolean
    mine: Boolean
  }

  extend type Mutation {
    updateChannel: YoutubeChannel
  }
`
