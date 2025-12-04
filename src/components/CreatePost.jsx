import { useState } from 'react'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
// import { createPost } from '../api/posts.js'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [imageURL, setImageURL] = useState('') // State for imageURL
  const [ingredients, setIngredients] = useState('')
  const [token] = useAuth()
  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, ingredients },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })
  /* const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, ingredients }),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  }) */
  const handleSubmit = (e) => {
    e.preventDefault()
    //createPostMutation.mutate()
    createPost()
  }

  if (!token) return <div>Please log in to create new posts.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-imageURL'>ImageURL: </label>{' '}
        {/* New input for imageURL */}
        <input
          type='text'
          name='create-imageURL'
          id='create-imageURL'
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-ingredients'>Ingredients: </label>{' '}
        {/* Add label */}
        <textarea
          id='create-ingredients'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder='Enter the ingredients here...' // Optional placeholder
        />
      </div>
      <br />
      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createPost ? (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>{' '}
          created successfully!
        </>
      ) : null}
    </form>
  )
}
