import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type YoutubeVideoCategorySnippet {
    assignable: Boolean
    channelId: String
    title: String
  }

  type YoutubeVideoCategory {
    id: ID!
    kind: String
    etag: String
    snippet: YoutubeVideoCategorySnippet
  }

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

  type YoutubeVideoStatus {
    uploadStatus: YoutubeVideoUploadStatus
    privacyStatus: PrivacyStatus
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

  type YoutubeVideo {
    id: ID
    url: URL
    kind: String
    etag: String
    snippet: YoutubeVideoSnippet
    status: YoutubeVideoStatus
    statistics: YoutubeVideoStatistics
  }

  extend type Query {
    listVideos: [YoutubeVideo]
    listVideoCategories: [YoutubeVideoCategory]
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
