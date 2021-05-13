import { ApolloError } from 'apollo-server-core'
import { DateTimeResolver, URLResolver } from 'graphql-scalars'
import { ResolverMap, YoutubeVideo, YoutubeVideoUploadOptions } from '../types'

export const resolvers: ResolverMap = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  Query: {
    async listVideos(root, args, { dataSources }) {
      const videos = await dataSources.youtube.listVideos()
      return videos
    }
  },
  Mutation: {
    async insertYoutubeVideo(
      root,
      args: YoutubeVideoUploadOptions,
      { dataSources },
      info
    ): Promise<YoutubeVideo> {
      const { title, description } = args
      const { createReadStream } = await args.videoFile
      let upload: YoutubeVideo
      try {
        upload = await new Promise((resolve, reject) =>
          dataSources.youtube.youtube.videos.insert(
            {
              auth: dataSources.youtube.auth,
              part: ['snippet', 'contentDetails', 'status'],

              // resource: {
              //   // Video title and description
              //   snippet: {
              //     title: title,
              //     description: description
              //   },
              //   // I set to private for tests
              //   status: {
              //     privacyStatus: options.status
              //   }
              // },

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
