import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function Post({
  title,
  ingredients,
  author,
  _id,
  imageURL,
  fullPost = false,
}) {
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${_id}/${slug(title)}`}>
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
      {author && (
        <em>
          {fullPost && <br />}
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.string,
  author: PropTypes.string,
  imageURL: PropTypes.string,
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
