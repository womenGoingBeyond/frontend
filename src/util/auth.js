import jwt_decode from 'jwt-decode'

/**
 * The **Auth** class creates a namespace for accessing the static methods for authentication and authorization.
 *
 * @class
 */
export default class Auth {
  static baseURL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN

  /**
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{data: object}>}
   */
  static async register({email, password}) {
    const url = `${this.baseURL}/api/auth/local/register?fields[0]=user `

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        'email': email,
        'username': email.replace('@', '_'),
        'password': password,
        'blocked': true
      })
    })
    return await response.json()
  }

  /**
   *
   * @param {string} identifier
   * @param {string} password
   * @returns {Promise<{data: object}>}
   */
  static async login({identifier, password}) {
    const url = `${this.baseURL}/api/auth/local`

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        'identifier': identifier,
        'password': password
      })
    })
    return await response.json()
  }

  /**
   *
   * @returns {boolean}
   */
  static logout() {
    if (window.localStorage.getItem('wgb-jwt') !== null) {
      window.localStorage.removeItem('wgb-jwt')
      return true
    }

    return false
  }

  /**
   *
   * @return {number}
   */
  static getUserIdFromJWT() {
    const token = window.localStorage.getItem('wgb-jwt')
    if (token === null) return 0

    const decoded = jwt_decode(token)
    return decoded.id
  }
}
