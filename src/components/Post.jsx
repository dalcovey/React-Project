import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useState } from 'react'

export function Post({
  title,
  ingredients,
  author,
  id,
  imageURL,
  fullPost = false,
  likes,
  likedByCurrentUser = false,
}) {
  const [token] = useAuth()
  // Local state for optimistic UI (optional, can be replaced with mutation result)
  const [liked, setLiked] = useState(likedByCurrentUser)
  const [likeCount, setLikeCount] = useState(likes ?? 0)

  const handleLikeToggle = async () => {
    if (!token) return
    try {
      const endpoint = liked
        ? `${import.meta.env.VITE_BACKEND_URL}/posts/${id}/unlike`
        : `${import.meta.env.VITE_BACKEND_URL}/posts/${id}/like`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('Failed to update like')
      const updatedPost = await res.json()
      setLiked(!liked)
      setLikeCount(updatedPost.likes ?? likeCount)
    } catch (err) {
      // Optionally show error to user
      console.error('Error updating like:', err)
    }
  }

  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      {fullPost && imageURL && (
        <img
          src={imageURL}
          alt={title}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      {fullPost && <div>{ingredients}</div>}
      {/* Show likes if available */}
      {typeof likeCount === 'number' && (
        <div style={{ margin: '8px 0' }}>
          <span role='img' aria-label='likes'>
            ❤️
          </span>{' '}
          {likeCount} like{likeCount === 1 ? '' : 's'}
        </div>
      )}
      {/* Like/Unlike button for logged-in users */}
      {token && (
        <button onClick={handleLikeToggle} style={{ marginBottom: 8 }}>
          {liked ? 'Unlike' : 'Like'}
        </button>
      )}
      {author && (
        <em>
          {fullPost && <br />}
          Written by <User {...author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  imageURL: PropTypes.string,
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
  likes: PropTypes.number,
  likedByCurrentUser: PropTypes.bool,
}
