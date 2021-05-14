import { gql } from 'apollo-server-core'
import { typeDefs as videoDefs } from './Video/typeDefs'
import { typeDefs as channelDefs } from './Channel/typeDefs'
import { typeDefs as playlistDefs } from './Playlist/typeDefs'
import { scalarDefs } from './scalars'
import { enumDefs } from './enums'

export const typeDefs = gql`
  ${scalarDefs}
  ${videoDefs}
  ${channelDefs}
  ${playlistDefs}
  ${enumDefs}

  interface Node {
    id: ID!
  }

  type GoogleCredentials {
    refresh_token: String
    expiry_date: Int
    access_token: String
    token_type: String
    id_token: String
    scope: String
  }

  type Query {
    node(id: ID!): Node
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
`
