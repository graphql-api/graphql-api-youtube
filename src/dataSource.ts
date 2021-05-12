import { DataSource } from 'apollo-datasource'
import { KeyValueCache } from 'apollo-server-caching'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { Credentials } from './types'

const OAuth2 = google.auth.OAuth2
const envKey = 'YOUTUBE_AUTH_TOKEN'

export interface YoutubeDataSourceConfig<TContext> extends Credentials {
	context: TContext
	cache: KeyValueCache
}

export class YoutubeDataSource<TContext = any> extends DataSource<TContext> {
	private static getAuthToken(): string {
		if (!process.env[envKey])
			throw new Error('Add Auth Token in Environment variables')
		return process.env[envKey] as string
	}

	_auth?: OAuth2Client
	get auth(): OAuth2Client {
		if (this._auth) return this.auth
		this._auth = new OAuth2(
			config.client_id,
			config.client_secret,
			config.redirect_uris[0]
		)
		return this._auth
	}

	initialize?(config: YoutubeDataSourceConfig<TContext>): void | Promise<void> {
		const token = YoutubeDataSource.getAuthToken()
		// this.auth = new OAuth2(
		// 	config.client_id,
		// 	config.client_secret,
		// 	config.redirect_uris[0]
		// )
	}
}
