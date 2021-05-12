import { gql } from 'apollo-server-core'
import { URLTypeDefinition } from 'graphql-scalars'

export const typeDefs = gql`
  ${URLTypeDefinition}

  type GoogleCredentials {
    refresh_token: String
    expiry_date: Int
    access_token: String
    token_type: String
    id_token: String
    scope: String
  }

  type YoutubeChannel {
    name: String
  }

  type YoutubeVideo {
    url: URL
    title: String
    description: String
  }

  input UploadYoutubeVideoInput {
    title: String
    description: String
    privacyStatus: String
  }

  type Query {
    channel(input: ChannelInput): YoutubeChannel
    listChannels(input: ListChannelInput): [YoutubeChannel]
    listVideos: [YoutubeVideo]
  }

  type Mutation {
    generateAuthUrl: URL
    getToken(input: GetTokenInput): GoogleCredentials
    uploadYoutubeVideo(input: UploadYoutubeVideoInput!): YoutubeVideo
  }

  input GetTokenInput {
    code: String
  }

  input ChannelInput {
    name: String
  }
  input ListChannelInput {
    mine: Boolean
  }
`
