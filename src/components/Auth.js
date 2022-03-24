import PropTypes from 'prop-types'

export default async function auth({email, password}) {
  const baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_WP_DOMAIN : process.env.REACT_APP_DEV_WP_DOMAIN
  const url2 = `${baseURL}/?rest_route=/api/v1/auth`

  let response = await fetch(url2, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email, password: password})
  })
  const {data, success} = await response.json()
  const jwt = data.jwt

  return {jwt, success}
}

auth.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
