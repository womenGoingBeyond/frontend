export default class Api {
  static baseURL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN

  /**
   * @static
   * @async
   * @param endpoint {string}
   * @return {Promise<object>}
   */
  static async get(endpoint) {
    if (!endpoint || typeof endpoint !== 'string') return

    /* check if token is present in sessionStorage else return an empty object*/
    const storedToken = window.sessionStorage.getItem('wgb-jwt')
    if (storedToken === null) {
      return { msg: 'no jwt' }
    }

    let data

    try {
      const response = await fetch(`${this.baseURL}/${endpoint.trim()}`, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        })
      })
      data = await response.json()
    } catch (e) {
      console.error(e)
    }

    return data
  }

  /**
   * @static
   * @async
   * @param {string} endpoint
   * @param {object} body
   * @return {Promise<*|{msg: string}>}
   */
  static async post(endpoint, body = {}) {
    if (!endpoint || typeof endpoint !== 'string') return

    /* check if token is present in sessionStorage else return an empty object*/
    const storedToken = window.sessionStorage.getItem('wgb-jwt')
    if (storedToken === null) {
      return { msg: 'no jwt' }
    }

    let data = null
    try {
      let response = await fetch(`${this.baseURL}/${endpoint.trim()}`, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }),
        body: JSON.stringify(body)
      })
      data = await response.json()
    } catch (e) {
      console.error(e)
    }
    return data
  }

  /**
   * @static
   * @async
   * @param {string} endpoint
   * @param {object} body
   * @return {Promise<*|{msg: string}>}
   */
  static async put(endpoint, body = {}) {
    if (!endpoint || typeof endpoint !== 'string') return

    /* check if token is present in sessionStorage else return an empty object*/
    const storedToken = window.sessionStorage.getItem('wgb-jwt')
    if (storedToken === null) {
      return { msg: 'no jwt' }
    }

    let data

    try {
      let response = await fetch(`${this.baseURL}/${endpoint.trim()}`, {
        method: 'PUT',
        mode: 'cors',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }),
        body: JSON.stringify(body)
      })
      data = await response.json()
    } catch (e) {
      console.error(e)
    }

    return data
  }
}
