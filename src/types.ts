import { ReadStream } from 'fs'
import { GraphQLResolverMap } from 'apollo-graphql'
import { YoutubeDataSource } from './dataSource'
import { youtube_v3 } from 'googleapis'

export type ResolverMap = GraphQLResolverMap<{
  dataSources: { youtube: YoutubeDataSource }
}>

export interface YoutubeVideoUploadOptions {
  title: string
  videoFile: { createReadStream: () => ReadStream }
  description: string
  privacyStatus: string
}

export interface YoutubeVideo extends youtube_v3.Schema$Video {
  url: String
}

export interface Credentials {
  client_id: string
  project_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_secret: string
  redirect_uris: Array<string>
  javascript_origins: Array<string>
}

export interface IGoogleAuth {}

export type Scope =
  | 'https://www.googleapis.com/auth/youtubepartner'
  | 'https://www.googleapis.com/auth/youtube'
  | 'https://www.googleapis.com/auth/youtube.force-ssl'
  | 'https://www.googleapis.com/auth/youtubepartner-channel-audit'
