import { DataSource } from 'apollo-datasource'
import { KeyValueCache } from 'apollo-server-caching'
import { OAuth2Client } from 'google-auth-library'
import { google, youtube_v3, youtubeAnalytics_v2 } from 'googleapis'
import { Credentials } from './types'
// import CREDO from '../../../../credentials.json'
import { sign } from 'jsonwebtoken'

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

const SCOPES = [
  // 'https://www.googleapis.com/auth/yt-analytics-monetary',
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
  private auth: OAuth2Client

  get youtube(): youtube_v3.Youtube {
    return this.client.youtube('v3')
  }

  get youtubeAnalytics(): youtubeAnalytics_v2.Youtubeanalytics {
    return this.client.youtubeAnalytics('v2')
  }

  constructor({
    client_id,
    client_secret,
    redirect_uri,
    credentialsBase64
  }: {
    client_id: string
    client_secret: string
    redirect_uri?: string
    credentialsBase64?: string
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

    // google
    //   .youtube('v3')
    //   // .channels.list({
    //   //   part: ['contentOwnerDetails'],
    //   .playlists.list({
    //     // part: ['contentDetails', 'id'],
    //     // channelId: 'UCtFmdP2xug6Dwy6AIm8kFgw',
    //     forUsername: 'lernezeichnen',

    //     // onBehalfOfContentOwner: '116701463209545040319',
    //     // managedByMe: true,
    //     // channelId: 'UCtFmdP2xug6Dwy6AIm8kFgw',
    //     auth
    //   })
    //   .then((data) => console.log(data, data?.data.items))
    //   .catch((err) => {
    //     console.log('ERROR', err)
    // })
    // try {
    //   credentials = credentialsString
    //     .replace('{ "', '')
    //     .replace('" }', '')
    //     .split('", "')
    //     .map((part) => part.split('": "'))
    //     .reduce((p, c) => ({ ...p, [c[0]]: c[1] }), {})
    // } catch (err) {
    //   console.log(err)
    // } finally {
    //   // console.log(credentials)
    //   // const auth = new GoogleAuth({ credentials })
    //   // google.options({ auth })
    //   // this.client = google.youtube('v3')
    //   // this.client.activities.list().then((data) => {
    //   //   console.log('LIST', data)
    //   // })
    // }
    // console.log('construct', client_id, client_secret, redirect_uri)
    // this._auth = new OAuth2(client_id, client_secret, redirect_uri)
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

  /** activities */

  async listActivities() {}

  /** channels */
  async listChannels(
    args?: Omit<youtube_v3.Params$Resource$Channels$List, 'part'>
  ) {
    console.log('LISTCHANNELS')
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

      id: 'UCtFmdP2xug6Dwy6AIm8kFgw',
      // mine: true,
      auth: this.auth
    })
    console.log(response.data.items)
    return response.data.items
  }

  /** videos */

  async listVideos(args): Promise<youtube_v3.Schema$Video[]> {
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
     
      auth: this.auth
      // onBehalfOfContentOwner: channelId
    })
    console.log(response.data.items)
    return response.data.items
  }

  /** YouTube Analytics API */

  /** YouTube Reporting API */
}

const channelId = 'UCtFmdP2xug6Dwy6AIm8kFgw'
