import { Link } from 'react-router-dom'
export function Header() {
  return (
    <div>
      <h1>Welcome to My Blog!</h1>
      <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
