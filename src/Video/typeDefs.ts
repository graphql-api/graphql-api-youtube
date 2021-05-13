import { gql } from 'graphql-tag'
import { URLTypeDefinition } from 'graphql-scalars'

export const typeDefs = gql`
  type YoutubeVideoThumbnail {
    url: URL
    width: Int
    height: Int
  }

  type YoutubeVideoThumbnails {
    default: YoutubeVideoThumbnail
    medium: YoutubeVideoThumbnail
    high: YoutubeVideoThumbnail
    standard: YoutubeVideoThumbnail
    maxres: YoutubeVideoThumbnail
  }

  type YoutubeVideoSnippet {
    publishedAt: String
    channelId: String
    channelTitle: String
    title: String
    description: String
    categoryId: String
    thumbnails: YoutubeVideoThumbnails
    tags: [String]
  }

  type YoutubeVideoContentRating {
    id: String
  }

  enum YoutubeVideoProjection {
    rectangular
  }

  type YoutubeVideoContentDetails {
    duration: String
    dimension: String
    definition: String
    caption: Boolean
    licensedContent: Boolean
    contentRating: YoutubeVideoContentRating
    projection: YoutubeVideoProjection
  }

  enum YoutubeVideoUploadStatus {
    processed
  }

  enum YoutubeVideoPrivacyStatus {
    public
  }

  type YoutubeVideoStatus {
    uploadStatus: YoutubeVideoUploadStatus
    privacyStatus: YoutubeVideoPrivacyStatus
    license: String
    embeddable: Boolean
    publicStatsViewable: Boolean
    madeForKids: Boolean
  }

  type YoutubeVideoStatistics {
    viewCount: Int
    likeCount: Int
    dislikeCount: Int
    favoriteCount: Int
    commentCount: Int
  }

  type YoutubeVideoPlayer {
    embedHtml: String
  }

  type YoutubeVideoTopicDetails {
    topicCategories: [String]
  }

  #  type YoutubeVideoRecordingDetails {}

  type YoutubeVideo {
    id: ID
    kind: String
    etag: String
    snippet: YoutubeVideoSnippet
    status: YoutubeVideoStatus
    statistics: YoutubeVideoStatistics
  }

  extend type Query {
    listVideos: [YoutubeVideo]
    getRating: String
  }

  extend type Mutation {
    insertYoutubeVideo(input: UploadYoutubeVideoInput!): YoutubeVideo
    updateYoutubeVideo: YoutubeVideo
    rateYoutubeVideo: YoutubeVideo
    reportAbuse: YoutubeVideo
    deleteYoutubeVideo: YoutubeVideo
  }

  input UploadYoutubeVideoInput {
    title: String
    description: String
    privacyStatus: String
  }
`
