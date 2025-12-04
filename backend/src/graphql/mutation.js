import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost } from '../services/posts.js'
export const mutationSchema = `#graphql

type Mutation {
signupUser(username: String!, password: String!): User
loginUser(username: String!, password: String!): String
createPost(title: String!, ingredients: String, tags:[String]): Post
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
    createPost: async (parent, { title, ingredients, tags }, { auth }) => {
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
      return await createPost(auth.sub, { title, ingredients, tags })
    },
  },
}
