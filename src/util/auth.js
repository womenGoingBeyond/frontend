import jwt_decode from 'jwt-decode'
import isBefore from 'date-fns/isBefore'

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
   * @static
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{jwt: string, user: {}, error: {}}>}
   */
  static async register({ email, password }) {
    const url = `${this.baseURL}/api/auth/local/register`

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
        'password': password
      })
    })
    return response.json()
  }

  /**
   *
   * @static
   * @async
   * @param {string} identifier
   * @param {string} password
   * @returns {Promise<{jwt: string, user: {}, error: {}}>}
   */
  static async login({ identifier, password }) {
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
    return response.json()
  }

  /**
   * The **logout** method logs the user out through deleting the jwt from sessionStorage.
   *
   * @static
   * @see https://github.com/strapi/strapi-examples/blob/master/login-react/src/pages/Home.js#L28
   * @see https://forum.strapi.io/t/does-strapi-has-a-logout-endpoint/14886
   * @returns {boolean}
   */
  static logout() {
    if (window.sessionStorage.getItem('wgb-jwt') !== null) {
      window.sessionStorage.removeItem('wgb-jwt')
      return true
    }

    return false
  }

  /**
   * @static
   * @return {number|undefined}
   */
  static getUserIdFromJWT() {
    const token = window.sessionStorage.getItem('wgb-jwt')
    if (token === null) return

    const decoded = jwt_decode(token)
    return decoded.id
  }

  /**
   * The **validateExpFromJWT** method checks the exp from jwt stored in sessionStorage if it is not expired.
   *
   * @static
   * @return {boolean}
   */
  static validateExpFromJWT() {
    const token = window.sessionStorage.getItem('wgb-jwt')
    if (token === null) return false

    const exp = jwt_decode(token).exp
    return isBefore(Date.now(), new Date(exp * 1000))
  }
}
