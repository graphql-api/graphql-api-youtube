import { ReadStream } from 'fs'
import { youtube_v3 } from 'googleapis'

export interface YoutubeVideoUploadOptions {
	title: string
	videoFile: { createReadStream: () => ReadStream }
	description: string
	privacyStatus: string
}

export interface YoutubeVideo extends youtube_v3.Schema$Video {}

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
