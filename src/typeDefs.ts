import { gql } from 'apollo-server-core'
import { URLTypeDefinition } from 'graphql-scalars'

export const typeDefs = gql`
  scalar Upload
  ${URLTypeDefinition}

  type YoutubeVideo {
    url: URL
    title: String
    description: String
  }

  type Mutation {
    uploadYoutubeVideo(input:UploadYoutubeVideoInput!):YoutubeVideo 
  }

  input UploadYoutubeVideoInput {
    title: String
    description: String
    file: Upload!
    privacyStatus: String
  }

`
