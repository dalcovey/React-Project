import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Post({ title, ingredients, author: userId, imageURL }) {
  return (
    <article>
      <h3>{title}</h3>
      {imageURL && (
        <img
          src={imageURL}
          alt={title}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}{' '}
      {/* Display image */}
      <div>{ingredients}</div>
      {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.string,
  author: PropTypes.string,
  imageURL: PropTypes.string, // Add imageURL to prop types
}
