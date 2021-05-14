import { ApolloError } from 'apollo-server-core'
import { youtube_v3 } from 'googleapis'
import { ResolverMap, YoutubeVideo, YoutubeVideoUploadOptions } from '../types'

export const resolvers: ResolverMap = {
  YoutubeVideo: {
    async url(root) {
      return 'https://www.youtube.com/watch?v=' + root.id
    }
  },
  Query: {
    async listVideoCategories(root, args, { dataSources }) {
      const videoCategories: youtube_v3.Schema$VideoCategory[] = await dataSources.youtube.listVideoCategories()
      return videoCategories
    },
    async listVideos(root, args, { dataSources }) {
      const videos = await dataSources.youtube.listVideos()
      return videos
    },
    async getRating() {}
  },
  Mutation: {
    async insertYoutubeVideo(
      root,
      args: YoutubeVideoUploadOptions,
      { dataSources },
      info
    ): Promise<YoutubeVideo> {
      const { title, description, privacyStatus = 'private' } = args
      const { createReadStream } = await args.videoFile
      let upload: YoutubeVideo
      try {
        upload = await new Promise((resolve, reject) => {
          dataSources.youtube.youtube.videos.insert(
            {
              auth: dataSources.youtube.auth,
              part: ['snippet', 'contentDetails', 'status'],
              requestBody: {
                // Video title and description
                snippet: { title, description },
                // I set to private for tests
                status: { privacyStatus }
              },

              // Create the readable stream to upload the video
              media: {
                body: createReadStream()
              }
            },
            (error: any, data) => {
              if (error) {
                console.log('Error While Uploading')
                return reject('Error While Uploading' + error)
              }
              const videoUrl = 'https://www.youtube.com/watch?v=' + data.data.id
              resolve({ ...data.data, url: videoUrl })
            }
          )
        })
      } catch (err) {
        new ApolloError(err)
      }
      return
    }
  }
}
