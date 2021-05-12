import { GraphQLResolverMap } from 'apollo-graphql'
import { ApolloError } from 'apollo-server-micro'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { YoutubeVideo, YoutubeVideoUploadOptions } from './types'

const OAuth2 = google.auth.OAuth2
const youtube = google.youtube('v3')

const SCOPES = [
	'https://www.googleapis.com/auth/youtube.upload',
	'https://www.googleapis.com/auth/youtube.readonly'
]

export const resolvers: GraphQLResolverMap<{ auth: OAuth2Client }> = {
	Mutation: {
		async googleAuth(root, args, { auth }, info) {
      const oauth2Client = new OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uris[0]
      );
  
      // Check if we have previously stored a token.
      try {
        const token = EnvConfig.getAuthToken();
        const authToken = await oauth2Client.getToken(token);
        oauth2Client.credentials = authToken.tokens;
        return oauth2Client;
      } catch (e) {
        console.log(e);
        return this.getNewToken(oauth2Client);
      }
    };
    },
		async getNewToken(root, args, { auth }) {
			const authUrl = auth.generateAuthUrl({
				access_type: 'offline',
				scope: SCOPES
			})

			console.log('Authorize this app by visiting this url: ', authUrl)
			return { authUrl }
			// Save Auth token in Environment Variable
		},
		async uploadYoutubeVideo(
			root,
			args: YoutubeVideoUploadOptions,
			{ auth },
			info
		): Promise<YoutubeVideo> {
			const { title, description } = args
			const { createReadStream } = await args.videoFile
			let upload: YoutubeVideo
			try {
				upload = await new Promise((resolve, reject) =>
					youtube.videos.insert(
						{
							auth,
							part: ['snippet', 'contentDetails', 'status'],

							resource: {
								// Video title and description
								snippet: {
									title: title,
									description: description
								},
								// I set to private for tests
								status: {
									privacyStatus: options.status
								}
							},

							// Create the readable stream to upload the video
							media: {
								body: createReadStream()
							}
						},
						(error: any, data: any) => {
							if (error) {
								console.log('Error While Uploading')
								return reject('Error While Uploading' + error)
							}
							const videoUrl = 'https://www.youtube.com/watch?v=' + data.data.id
							console.log(videoUrl)
							resolve({ url: videoUrl })
						}
					)
				)
			} catch (err) {
				new ApolloError(err)
			}
			return 
		}
	}
}
