import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

export async function createPost(
  userId,
  { title, ingredients, tags, imageURL },
) {
  const post = new Post({ title, author: userId, ingredients, tags, imageURL })
  return await post.save()
}
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}
export async function listAllPosts(options) {
  return await listPosts({}, options)
}
export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listPosts({ author: user._id }, options)
}
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}
export async function getPostById(postId) {
  return await Post.findById(postId)
}
export async function updatePost(
  userId,
  postId,
  { title, ingredients, tags, imageURL },
) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, ingredients, tags, imageURL } },
    { new: true },
  )
}
export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}
export async function likePost(postId) {
  return await Post.findByIdAndUpdate(
    postId,
    { $inc: { likes: 1 } },
    { new: true },
  )
}
export async function unlikePost(postId) {
  return await Post.findByIdAndUpdate(
    postId,
    { $inc: { likes: -1 } },
    { new: true },
  )
}
