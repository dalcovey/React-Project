import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { io } from 'socket.io-client'

// Derive socket.io URL from VITE_BACKEND_URL by stripping /api/v1 if present
let backendSocketUrl =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/v1'
if (backendSocketUrl.endsWith('/api/v1')) {
  backendSocketUrl = backendSocketUrl.replace(/\/api\/v1$/, '')
}
// import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
// import { createPost } from '../api/posts.js'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [imageURL, setImageURL] = useState('') // State for imageURL
  const [ingredients, setIngredients] = useState('')
  const [token] = useAuth()
  const [createPost, { loading }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, ingredients, imageURL },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })
  const [postCreatedMsg, setPostCreatedMsg] = useState('')
  const [postCreatedLink, setPostCreatedLink] = useState(null)

  useEffect(() => {
    const socket = io(backendSocketUrl)
    socket.on('connect', () => {
      console.log('[socket.io] Connected to backend:', backendSocketUrl)
    })
    socket.on('disconnect', () => {
      console.log('[socket.io] Disconnected from backend')
    })
    // listen for postCreated events from the backend and set success message with link
    socket.on('postCreated', ({ post }) => {
      console.log('[socket.io] postCreated event received:', post)
      setPostCreatedMsg(`Post "${post.title}" created successfully!`)
      setPostCreatedLink(`/posts/${post.id || post._id}/${slug(post.title)}`)
      setTimeout(() => {
        setPostCreatedMsg('')
        setPostCreatedLink(null)
      }, 15000)
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
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
      {postCreatedMsg && (
        <>
          <br />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: 4,
              padding: '8px 16px',
              margin: '8px 0',
              fontWeight: 'bold',
              position: 'relative',
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <span style={{ flex: 1 }}>
              {postCreatedMsg}
              {postCreatedLink && (
                <>
                  {' '}
                  <Link
                    to={postCreatedLink}
                    style={{
                      color: '#0c5460',
                      textDecoration: 'underline',
                      marginLeft: 8,
                    }}
                  >
                    View post
                  </Link>
                </>
              )}
            </span>
            <button
              onClick={() => {
                setPostCreatedMsg('')
                setPostCreatedLink(null)
              }}
              style={{
                marginLeft: 12,
                background: 'transparent',
                border: 'none',
                color: '#155724',
                fontWeight: 'bold',
                fontSize: 18,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label='Dismiss notification'
            >
              ×
            </button>
          </div>
        </>
      )}
    </form>
  )
}
