import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost } from '../services/posts.js'
export const mutationSchema = `#graphql

type Mutation {
signupUser(username: String!, password: String!): User
loginUser(username: String!, password: String!): String
createPost(title: String!, ingredients: String, tags:[String], imageURL: String): Post
}
`
export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },
    createPost: async (
      parent,
      { title, ingredients, tags, imageURL },
      { auth, app },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      const post = await createPost(auth.sub, {
        title,
        ingredients,
        tags,
        imageURL,
      })
      // Use socket.io to emit postCreated event for all users
      if (app && app.get) {
        const io = app.get('io')
        if (io) {
          io.emit('postCreated', { post })
        }
      }
      return post
    },
  },
}
