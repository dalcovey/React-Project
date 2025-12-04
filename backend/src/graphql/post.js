import { getUserInfoById } from '../services/users.js'
export const postSchema = `#graphql
type Post {
id: ID!
title: String!
author: User
ingredients: String
tags: [String!]
imageURL: String
createdAt: Float
updatedAt: Float
}
`
export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author)
    },
  },
}
