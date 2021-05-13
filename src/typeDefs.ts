import { gql } from 'apollo-server-core'
import { URLTypeDefinition } from 'graphql-scalars'
import { typeDefs as videoDefs } from './Video/typeDefs'

export const typeDefs = gql`
  ${URLTypeDefinition}
  ${videoDefs}

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

  type Query {
    channel(input: ChannelInput): YoutubeChannel
    listChannels(input: ListChannelInput): [YoutubeChannel]
  }

  type Mutation {
    generateAuthUrl: URL
    getToken(input: GetTokenInput): GoogleCredentials
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
