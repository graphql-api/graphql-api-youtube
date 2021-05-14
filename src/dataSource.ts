import { DataSource } from 'apollo-datasource'
import { KeyValueCache } from 'apollo-server-caching'
import { OAuth2Client } from 'google-auth-library'
import { google, youtube_v3, youtubeAnalytics_v2 } from 'googleapis'
import { Credentials, Scope } from './types'

const OAuth2 = google.auth.OAuth2
const GoogleAuth = google.auth.GoogleAuth
const envKey = 'YOUTUBE_AUTH_TOKEN'

type Base64String = string
function base64(i: string): Base64String {
  return Buffer.from(i, 'utf8').toString('base64')
}

function unbase64(i: Base64String): string {
  return Buffer.from(i, 'base64').toString('utf-8')
}

export interface YoutubeDataSourceConfig<TContext> extends Credentials {
  context: TContext
  cache: KeyValueCache
}

const SCOPES: Scope[] = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtubepartner',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtubepartner-channel-audit'
]

type YoutubeDataSourceConstructor = {
  access_token?: String
  refresh_token?: String
  token_type?: String
}

export class YoutubeDataSource<TContext = any> extends DataSource<TContext> {
  client: typeof google
  auth: OAuth2Client

  get youtube(): youtube_v3.Youtube {
    return this.client.youtube('v3')
  }

  get youtubeAnalytics(): youtubeAnalytics_v2.Youtubeanalytics {
    return this.client.youtubeAnalytics('v2')
  }

  constructor({
    client_id,
    client_secret,
    redirect_uri
  }: {
    client_id: string
    client_secret: string
    redirect_uri?: string
  }) {
    super()
    // const credentialsString = unbase64(process.env.GOOGLE_CREDENTIALS)
    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uri)
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    })

    oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log('FRESH', tokens)
      }
      console.log('TOKENS', tokens)
    })
    this.auth = oauth2Client

    const auth = new GoogleAuth({
      keyFile: './credentials.json',
      scopes: SCOPES
    })

    this.client = google
    this.client.options({ auth: oauth2Client })
  }

  async generateAuthUrl() {
    const url = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    return url
  }

  async getToken(authCode) {
    console.log('GET AUTH TOKEN', authCode)
    const token = await this.auth.getToken(authCode)
    console.log('TOKEN', token)
    return token
  }

  async search() {
    return
  }

  /** activities */

  async listActivities() {
    return
  }

  /** channels */

  async listChannels(
    args?: Omit<youtube_v3.Params$Resource$Channels$List, 'part'>
  ) {
    const response = await this.youtube.channels.list({
      part: [
        'auditDetails',
        'brandingSettings',
        'contentDetails',
        'contentOwnerDetails',
        'id',
        'localizations',
        'snippet',
        'statistics',
        'status',
        'topicDetails'
      ],
      mine: true,
      auth: this.auth
    })
    return response.data.items
  }

  async updateChannel({
    id,
    brandingSettings,
    localizations
  }: youtube_v3.Schema$Channel) {
    return this.youtube.channels.update({
      requestBody: {
        id,
        brandingSettings,
        localizations
      }
    })
  }

  async listChannelVideos({ username }: { username: string }) {
    const contentDetails = await this.youtube.channels.list({
      part: ['contentDetails'],
      mine: true
    })
    const id =
      contentDetails.data.items[0].contentDetails.relatedPlaylists.uploads
    const videos = await this.youtube.playlistItems.list({ playlistId: id })
    return videos.data.items
  }

  /** playlists */

  async listPlaylists(
    args?: youtube_v3.Params$Resource$Playlistitems$List
  ): Promise<youtube_v3.Schema$Playlist[]> {
    const playlists = await this.youtube.playlists.list({
      part: ['contentDetails', 'snippet', 'localizations'],
      ...args
    })
    return playlists.data.items
  }

  async listPlaylistItems(
    args?: youtube_v3.Params$Resource$Playlistitems$List
  ): Promise<youtube_v3.Schema$PlaylistItem[]> {
    const playlistItems = await this.youtube.playlistItems.list({
      part: ['id', 'contentDetails'],
      ...args
    })
    return playlistItems.data.items
  }

  /** videos */

  async listVideoCategories() {
    const response = await this.youtube.videoCategories.list({
      part: ['snippet']
    })
    return response.data.items
  }

  async listVideos(
    args: youtube_v3.Params$Resource$Videos$List = { chart: 'mostPopular' }
  ): Promise<youtube_v3.Schema$Video[]> {
    const response = await this.youtube.videos.list({
      part: [
        'contentDetails',
        // 'fileDetails',
        'id',
        'liveStreamingDetails',
        'localizations',
        'player',
        // 'processingDetails',
        'recordingDetails',
        'snippet',
        'statistics',
        'status',
        // 'suggestions',
        'topicDetails'
      ],
      ...args
      // onBehalfOfContentOwner: channelId
    })
    return response.data.items
  }

  async getRating() {
    return this.youtube.videos.getRating()
  }

  /** YouTube Analytics API */

  /** YouTube Reporting API */
}
