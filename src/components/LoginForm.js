import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const LoginForm = ({ login }) => {
  const navigate = useNavigate()
  const { clear: clearusr, ...username } = useField('text')
  const { clear: clearpswd, ...password } = useField('password')

  const logUserIn = (event) => {
    event.preventDefault()

    login({
      username: username.value,
      password: password.value
    })

    clearusr()
    clearpswd()
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={logUserIn}>
        <div>
          username
          <input
            id='username'
            value={username.value}
            onChange={username.onChange}
          />
        </div>
        <div>
          password
          <input
            id='password'
            {...password}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
}

export default LoginForm